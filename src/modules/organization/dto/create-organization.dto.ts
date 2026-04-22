import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Công ty TNHH Vesta' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'VESTA', description: 'Mã tổ chức (unique)' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ example: '123 Nguyễn Huệ, Q1, TP.HCM' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '028-1234-5678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'contact@vesta.vn' })
  @IsOptional()
  @IsString()
  email?: string;
}
