import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto';
import { ERROR_MESSAGES } from '../../common/constants';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto) {
    const existing = await this.prisma.organization.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException(ERROR_MESSAGES.ORGANIZATION_CODE_EXISTS);
    }

    const org = await this.prisma.organization.create({
      data: dto,
    });

    this.logger.log(`Organization created: ${org.name} (${org.code})`);
    return org;
  }

  async findAll() {
    return this.prisma.organization.findMany({
      include: {
        _count: { select: { users: true, departments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        departments: true,
        _count: { select: { users: true } },
      },
    });

    if (!org) {
      throw new NotFoundException(ERROR_MESSAGES.ORGANIZATION_NOT_FOUND);
    }

    return org;
  }

  async update(id: string, dto: UpdateOrganizationDto) {
    await this.findOne(id);

    return this.prisma.organization.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.organization.delete({ where: { id } });

    this.logger.log(`Organization ${id} deleted`);
    return { message: 'Xóa tổ chức thành công' };
  }
}
