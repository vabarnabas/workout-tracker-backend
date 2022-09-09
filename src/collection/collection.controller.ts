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
import { Collection } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('collections')
export class CollectionController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  findAll(): Promise<Collection[]> {
    return this.prismaService.collection.findMany({
      include: {
        user: true,
        plans: { include: { workouts: true } },
      },
    });
  }

  @Get(':id')
  async findSpecificById(@Param('id') id: string): Promise<Collection> {
    const Collection = await this.prismaService.collection.findUnique({
      where: { id },
      include: {
        user: true,
        plans: { include: { workouts: true } },
      },
    });

    if (!Collection) throw new ForbiddenException('Acces denied.');

    return Collection;
  }

  @Post()
  async create(@Body() createCollectionInput: Collection) {
    return await this.prismaService.collection.create({
      data: createCollectionInput,
      include: {
        user: true,
        plans: { include: { workouts: true } },
      },
    });
  }

  @Post('connect/:id')
  async connect(@Param('id') id: string, @Body() body: { planId?: string }) {
    const collection = await this.prismaService.collection.findUnique({
      where: { id },
      include: {
        user: true,
        plans: { include: { workouts: true } },
      },
    });

    if (!collection) throw new ForbiddenException('Access denied.');

    if (body.planId) {
      await this.prismaService.collection.update({
        where: { id: collection.id },
        data: {
          plans: {
            connect: { id: body.planId },
          },
        },
        include: {
          user: true,
          plans: { include: { workouts: true } },
        },
      });
    }

    return await this.prismaService.collection.findUnique({
      where: { id },
      include: {
        user: true,
        plans: { include: { workouts: true } },
      },
    });
  }

  @Post('disconnect/:id')
  async disconnect(@Param('id') id: string, @Body() body: { planId?: string }) {
    const collection = await this.prismaService.collection.findUnique({
      where: { id },
      include: {
        user: true,
        plans: { include: { workouts: true } },
      },
    });

    if (!collection) throw new ForbiddenException('Access denied.');

    if (body.planId) {
      await this.prismaService.collection.update({
        where: { id: collection.id },
        data: {
          plans: {
            disconnect: { id: body.planId },
          },
        },
        include: {
          user: true,
          plans: { include: { workouts: true } },
        },
      });
    }

    return await this.prismaService.collection.findUnique({
      where: { id },
      include: {
        user: true,
        plans: { include: { workouts: true } },
      },
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCollectionInput: Collection,
  ) {
    const collection = await this.prismaService.collection.findUnique({
      where: { id },
      include: {
        user: true,
        plans: { include: { workouts: true } },
      },
    });

    if (!collection) throw new ForbiddenException('Access denied.');

    return await this.prismaService.collection.update({
      where: { id: collection.id },
      data: updateCollectionInput,
      include: {
        user: true,
        plans: { include: { workouts: true } },
      },
    });
  }

  @Delete(':id')
  // @Permit(PermissionType.UserManagement)
  async remove(@Param('id') id: string) {
    return await this.prismaService.collection.delete({
      where: { id },
      include: {
        user: true,
        plans: { include: { workouts: true } },
      },
    });
  }
}
