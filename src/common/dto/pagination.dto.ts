import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { APP_CONSTANTS } from '../constants';

export class PaginationDto {
  @ApiPropertyOptional({ minimum: 1, default: 1, description: 'Trang hiện tại' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: APP_CONSTANTS.MAX_PAGE_SIZE,
    default: APP_CONSTANTS.DEFAULT_PAGE_SIZE,
    description: 'Số bản ghi mỗi trang',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(APP_CONSTANTS.MAX_PAGE_SIZE)
  limit?: number = APP_CONSTANTS.DEFAULT_PAGE_SIZE;

  get skip(): number {
    return ((this.page ?? 1) - 1) * (this.limit ?? APP_CONSTANTS.DEFAULT_PAGE_SIZE);
  }
}
