import {
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CheckInDto, CheckOutDto, QueryAttendanceDto } from './dto';
import { ERROR_MESSAGES } from '../../common/constants';
import { Prisma } from '@prisma/client';

@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async checkIn(userId: string, organizationId: string, dto: CheckInDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existing = await this.prisma.attendance.findUnique({
      where: {
        userId_date: { userId, date: today },
      },
    });

    if (existing) {
      throw new BadRequestException(ERROR_MESSAGES.ALREADY_CHECKED_IN);
    }

    const attendance = await this.prisma.attendance.create({
      data: {
        userId,
        organizationId,
        date: today,
        checkIn: new Date(),
        note: dto.note,
      },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });

    this.logger.log(`User ${userId} checked in at ${attendance.checkIn}`);
    return attendance;
  }

  async checkOut(userId: string, organizationId: string, dto: CheckOutDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.prisma.attendance.findUnique({
      where: {
        userId_date: { userId, date: today },
      },
    });

    if (!attendance) {
      throw new BadRequestException(ERROR_MESSAGES.NOT_CHECKED_IN);
    }

    if (attendance.checkOut) {
      throw new BadRequestException(ERROR_MESSAGES.ALREADY_CHECKED_OUT);
    }

    const checkOutTime = new Date();

    // Calculate work hours
    const workHours = attendance.checkIn
      ? (checkOutTime.getTime() - attendance.checkIn.getTime()) / (1000 * 60 * 60)
      : 0;

    const updated = await this.prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOut: checkOutTime,
        workHours: Math.round(workHours * 100) / 100,
        note: dto.note || attendance.note,
      },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });

    this.logger.log(
      `User ${userId} checked out at ${checkOutTime}. Work hours: ${workHours.toFixed(2)}`,
    );

    return updated;
  }

  async getMyToday(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.attendance.findUnique({
      where: {
        userId_date: { userId, date: today },
      },
    });
  }

  async findAll(organizationId: string, query: QueryAttendanceDto) {
    const { userId, fromDate, toDate, status, limit, page } = query;
    const skip = query.skip;

    const where: Prisma.AttendanceWhereInput = {
      organizationId, // ← Multi-tenant filter
      ...(userId && { userId }),
      ...(status && { status }),
      ...(fromDate || toDate
        ? {
            date: {
              ...(fromDate && { gte: new Date(fromDate) }),
              ...(toDate && { lte: new Date(toDate) }),
            },
          }
        : {}),
    };

    const [attendances, total] = await Promise.all([
      this.prisma.attendance.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              department: { select: { name: true } },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      this.prisma.attendance.count({ where }),
    ]);

    return { attendances, total, page, limit };
  }
}
