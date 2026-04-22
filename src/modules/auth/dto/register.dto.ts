import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { APP_CONSTANTS } from '../../../common/constants';

export class RegisterDto {
  @ApiProperty({ example: 'admin@vesta.vn' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(APP_CONSTANTS.MIN_PASSWORD_LENGTH, {
    message: `Mật khẩu phải có ít nhất ${APP_CONSTANTS.MIN_PASSWORD_LENGTH} ký tự`,
  })
  password: string;

  @ApiProperty({ example: 'Nguyễn' })
  @IsString()
  @IsNotEmpty({ message: 'Họ không được để trống' })
  firstName: string;

  @ApiProperty({ example: 'Văn A' })
  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  lastName: string;

  @ApiProperty({ example: 'VESTA', description: 'Mã tổ chức' })
  @IsString()
  @IsNotEmpty({ message: 'Mã tổ chức không được để trống' })
  organizationCode: string;

  @ApiPropertyOptional({ example: '0901234567' })
  @IsOptional()
  @IsString()
  phone?: string;
}
