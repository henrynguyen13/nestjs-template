import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './dto';
import { APP_CONSTANTS, ERROR_MESSAGES } from '../../common/constants';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  // Fields to select (exclude password)
  private readonly userSelect: Prisma.UserSelect = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    phone: true,
    avatar: true,
    role: true,
    isActive: true,
    organizationId: true,
    departmentId: true,
    department: { select: { id: true, name: true } },
    createdAt: true,
    updatedAt: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  async create(organizationId: string, dto: CreateUserDto) {
    // Check if email exists
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      APP_CONSTANTS.BCRYPT_SALT_ROUNDS,
    );

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
        organizationId,
      },
      select: this.userSelect,
    });

    this.logger.log(`User created: ${user.email} in org ${organizationId}`);
    return user;
  }

  async findAll(organizationId: string, query: QueryUserDto) {
    const { search, role, departmentId, limit, page } = query;
    const skip = query.skip;

    const where: Prisma.UserWhereInput = {
      organizationId, // ← Multi-tenant filter
      ...(role && { role }),
      ...(departmentId && { departmentId }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: this.userSelect,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total, page, limit };
  }

  async findOne(organizationId: string, id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, organizationId }, // ← Multi-tenant filter
      select: this.userSelect,
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return user;
  }

  async update(organizationId: string, id: string, dto: UpdateUserDto) {
    await this.findOne(organizationId, id);

    const data: any = { ...dto };

    // Hash new password if provided
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, APP_CONSTANTS.BCRYPT_SALT_ROUNDS);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: this.userSelect,
    });
  }

  async remove(organizationId: string, id: string) {
    await this.findOne(organizationId, id);

    await this.prisma.user.delete({ where: { id } });

    this.logger.log(`User ${id} deleted from org ${organizationId}`);
    return { message: 'Xóa người dùng thành công' };
  }
}
