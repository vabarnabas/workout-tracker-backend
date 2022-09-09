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
import { Post as PostType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('posts')
export class PostController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  findAll(): Promise<PostType[]> {
    return this.prismaService.post.findMany({
      include: {
        user: true,
        plan: true,
      },
    });
  }

  @Get(':id')
  async findSpecificById(@Param('id') id: string): Promise<PostType> {
    const post = await this.prismaService.post.findUnique({
      where: { id },
      include: {
        user: true,
        plan: true,
      },
    });

    if (!post) throw new ForbiddenException('Acces denied.');

    return post;
  }

  @Post()
  async create(@Body() createPostInput: PostType) {
    return await this.prismaService.post.create({
      data: createPostInput,
      include: {
        user: true,
        plan: true,
      },
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePlanInput: PostType) {
    const plan = await this.prismaService.post.findUnique({
      where: { id },
      include: {
        user: true,
        plan: true,
      },
    });

    if (!plan) throw new ForbiddenException('Access denied.');

    return await this.prismaService.post.update({
      where: { id: plan.id },
      data: updatePlanInput,
      include: {
        user: true,
        plan: true,
      },
    });
  }

  @Delete(':id')
  // @Permit(PermissionType.UserManagement)
  async remove(@Param('id') id: string) {
    return await this.prismaService.post.delete({
      where: { id },
      include: {
        user: true,
        plan: true,
      },
    });
  }
}
