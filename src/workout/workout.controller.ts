import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { Workout } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('workouts')
export class WorkoutController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  findAll(): Promise<Workout[]> {
    return this.prismaService.workout.findMany({
      include: { plans: true, categories: true },
    });
  }

  @Get(':id')
  async findSpecificById(@Param('id') id: string): Promise<Workout> {
    const workout = await this.prismaService.workout.findUnique({
      where: { id },
      include: { plans: true, categories: true },
    });

    if (!workout) throw new ForbiddenException('Acces denied.');

    return workout;
  }

  @Post()
  async create(@Body() createWorkoutInput: Workout) {
    return await this.prismaService.workout.create({
      data: createWorkoutInput,
      include: { plans: true, categories: true },
    });
  }

  @Post('connect/:id')
  async connect(
    @Param('id') id: string,
    @Body() body: { planId?: string; categoryId?: string },
  ) {
    const workout = await this.prismaService.workout.findUnique({
      where: { id },
      include: { plans: true, categories: true },
    });

    if (!workout) throw new ForbiddenException('Access denied.');

    if (body.planId) {
      await this.prismaService.workout.update({
        where: { id: workout.id },
        data: {
          plans: {
            connect: { id: body.planId },
          },
        },
        include: { plans: true, categories: true },
      });
    }

    if (body.categoryId) {
      await this.prismaService.workout.update({
        where: { id: workout.id },
        data: {
          categories: {
            connect: { id: body.categoryId },
          },
        },
        include: { plans: true, categories: true },
      });
    }

    return await this.prismaService.workout.findUnique({
      where: { id },
      include: { plans: true, categories: true },
    });
  }

  @Post('disconnect/:id')
  async disconnect(
    @Param('id') id: string,
    @Body() body: { planId: string; categoryId: string },
  ) {
    const workout = await this.prismaService.workout.findUnique({
      where: { id },
      include: { plans: true, categories: true },
    });

    if (!workout) throw new ForbiddenException('Access denied.');

    if (body.planId) {
      await this.prismaService.workout.update({
        where: { id: workout.id },
        data: {
          plans: {
            disconnect: { id: body.planId },
          },
        },
        include: { plans: true, categories: true },
      });
    }

    if (body.categoryId) {
      await this.prismaService.workout.update({
        where: { id: workout.id },
        data: {
          categories: {
            disconnect: { id: body.categoryId },
          },
        },
        include: { plans: true, categories: true },
      });
    }

    return await this.prismaService.workout.findUnique({
      where: { id },
      include: { plans: true, categories: true },
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateWorkoutInput: Workout) {
    const workout = await this.prismaService.workout.findUnique({
      where: { id },
      include: { plans: true, categories: true },
    });

    if (!workout) throw new ForbiddenException('Access denied.');

    return await this.prismaService.workout.update({
      where: { id: workout.id },
      data: updateWorkoutInput,
      include: { plans: true, categories: true },
    });
  }

  @Delete(':id')
  // @Permit(PermissionType.UserManagement)
  async remove(@Param('id') id: string) {
    return await this.prismaService.workout.delete({
      where: { id },
      include: { plans: true, categories: true },
    });
  }
}
