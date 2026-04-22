import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { APP_CONSTANTS } from '../../../common/constants';

export class LoginDto {
  @ApiProperty({ example: 'admin@vesta.vn', description: 'Email đăng nhập' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Mật khẩu' })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(APP_CONSTANTS.MIN_PASSWORD_LENGTH, {
    message: `Mật khẩu phải có ít nhất ${APP_CONSTANTS.MIN_PASSWORD_LENGTH} ký tự`,
  })
  password: string;
}
