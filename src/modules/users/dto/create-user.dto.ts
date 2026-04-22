import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../../common/enums';
import { APP_CONSTANTS } from '../../../common/constants';

export class CreateUserDto {
  @ApiPropertyOptional({ example: 'user@vesta.vn' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiPropertyOptional({ example: '123456' })
  @IsString()
  @MinLength(APP_CONSTANTS.MIN_PASSWORD_LENGTH)
  password: string;

  @ApiPropertyOptional({ example: 'Nguyễn' })
  @IsString()
  firstName: string;

  @ApiPropertyOptional({ example: 'Văn B' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: '0901234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: Role, default: Role.EMPLOYEE })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ description: 'ID phòng ban' })
  @IsOptional()
  @IsString()
  departmentId?: string;
}
