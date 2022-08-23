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
import { WorkoutCategory } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  findAll(): Promise<WorkoutCategory[]> {
    return this.prismaService.workoutCategory.findMany({
      include: { workouts: true },
    });
  }

  @Get(':id')
  async findSpecificById(@Param('id') id: string): Promise<WorkoutCategory> {
    const workout = await this.prismaService.workoutCategory.findUnique({
      where: { id },
      include: { workouts: true },
    });

    if (!workout) throw new ForbiddenException('Acces denied.');

    return workout;
  }

  @Post()
  async create(@Body() createWorkoutInput: WorkoutCategory) {
    return await this.prismaService.workoutCategory.create({
      data: createWorkoutInput,
      include: { workouts: true },
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWorkoutInput: WorkoutCategory,
  ) {
    const workoutCategory = await this.prismaService.workoutCategory.findUnique(
      {
        where: { id },
        include: { workouts: true },
      },
    );

    if (!workoutCategory) throw new ForbiddenException('Access denied.');

    return await this.prismaService.workoutCategory.update({
      where: { id: workoutCategory.id },
      data: updateWorkoutInput,
      include: { workouts: true },
    });
  }

  @Delete(':id')
  // @Permit(PermissionType.UserManagement)
  async remove(@Param('id') id: string) {
    return await this.prismaService.workoutCategory.delete({
      where: { id },
      include: { workouts: true },
    });
  }
}
