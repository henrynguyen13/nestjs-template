import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './dto';
import { CurrentUser, Roles } from '../../common/decorators';
import type { RequestUser } from '../../common/interfaces';
import { Role } from '../../common/enums';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Tạo nhân viên mới (Admin)' })
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateUserDto) {
    return this.usersService.create(user.organizationId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách nhân viên' })
  findAll(@CurrentUser() user: RequestUser, @Query() query: QueryUserDto) {
    return this.usersService.findAll(user.organizationId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết nhân viên' })
  findOne(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.usersService.findOne(user.organizationId, id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Cập nhật nhân viên (Admin)' })
  update(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(user.organizationId, id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Xóa nhân viên (Admin)' })
  remove(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.usersService.remove(user.organizationId, id);
  }
}
