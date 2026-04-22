import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CheckInDto, CheckOutDto, QueryAttendanceDto } from './dto';
import { CurrentUser, Roles } from '../../common/decorators';
import type { RequestUser } from '../../common/interfaces';
import { Role } from '../../common/enums';

@ApiTags('Attendance')
@ApiBearerAuth()
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  @ApiOperation({ summary: 'Check-in hôm nay' })
  checkIn(@CurrentUser() user: RequestUser, @Body() dto: CheckInDto) {
    return this.attendanceService.checkIn(user.id, user.organizationId, dto);
  }

  @Post('check-out')
  @ApiOperation({ summary: 'Check-out hôm nay' })
  checkOut(@CurrentUser() user: RequestUser, @Body() dto: CheckOutDto) {
    return this.attendanceService.checkOut(user.id, user.organizationId, dto);
  }

  @Get('my-today')
  @ApiOperation({ summary: 'Xem chấm công hôm nay của tôi' })
  getMyToday(@CurrentUser() user: RequestUser) {
    return this.attendanceService.getMyToday(user.id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Danh sách chấm công (Admin/Manager)' })
  findAll(@CurrentUser() user: RequestUser, @Query() query: QueryAttendanceDto) {
    return this.attendanceService.findAll(user.organizationId, query);
  }
}
