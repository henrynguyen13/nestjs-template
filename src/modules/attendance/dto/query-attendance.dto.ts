import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto';
import { AttendanceStatus } from '../../../common/enums';

export class QueryAttendanceDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Lọc theo nhân viên' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ example: '2026-04-01', description: 'Từ ngày' })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({ example: '2026-04-30', description: 'Đến ngày' })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({ enum: AttendanceStatus, description: 'Trạng thái' })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;
}
