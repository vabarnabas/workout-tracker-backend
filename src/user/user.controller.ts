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
// import { PermissionType } from 'src/common/types/permission.types';
// import { Permit } from 'src/common/decorators/permit.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly prismaService: PrismaService) {}

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
  async create(@Body() createUserInput: User) {
    if (createUserInput?.password) {
      const salt = await genSalt();
      createUserInput.password = await hash(createUserInput.password, salt);
    }

    return await this.prismaService.user.create({
      data: createUserInput,
      include: { plans: true },
    });
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
