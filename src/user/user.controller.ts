import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { genSalt, hash } from 'bcrypt';
import { UserService } from './user.service';
// import { PermissionType } from 'src/common/types/permission.types';
// import { Permit } from 'src/common/decorators/permit.decorator';

@Controller('users')
export class UserController {
  constructor(
    private readonly prismaService: PrismaService,
    private userService: UserService,
  ) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.prismaService.user.findMany({ include: { plans: true } });
  }

  @Get(':id')
  async findSpecificById(@Param('id') id: string): Promise<User> {
    const users = await this.prismaService.user.findMany({
      where: { OR: [{ id: { equals: id } }, { handle: { equals: id } }] },
      include: { plans: true },
    });

    if (users.length === 0) throw new ForbiddenException('Access denied.');

    return users[0];
  }

  @Post()
  // @Permit(PermissionType.UserManagement)
  create(@Body() createUserInput: User) {
    return this.userService.create(createUserInput);
  }

  @Patch(':id')
  // @Permit(PermissionType.UserManagement)
  async update(@Param('id') id: string, @Body() updateUserInput: User) {
    if (updateUserInput?.password) {
      const salt = await genSalt();
      updateUserInput.password = await hash(updateUserInput.password, salt);
    }

    const users = await this.prismaService.user.findMany({
      where: { OR: [{ id: { equals: id } }, { handle: { equals: id } }] },
      include: { plans: true },
    });

    if (users.length === 0) throw new ForbiddenException('Access denied.');

    return await this.prismaService.user.update({
      where: { id: users?.[0]?.id },
      data: updateUserInput,
      include: { plans: true },
    });
  }

  @Delete(':id')
  // @Permit(PermissionType.UserManagement)
  async remove(@Param('id') id: string) {
    return await this.prismaService.user.delete({
      where: { id },
      include: { plans: true },
    });
  }
}
