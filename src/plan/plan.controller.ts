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
import { Plan } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('plans')
export class PlanController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  findAll(): Promise<Plan[]> {
    return this.prismaService.plan.findMany({
      include: {
        user: true,
        workouts: { include: { categories: true } },
      },
    });
  }

  @Get(':id')
  async findSpecificById(@Param('id') id: string): Promise<Plan> {
    const plan = await this.prismaService.plan.findUnique({
      where: { id },
      include: {
        user: true,
        workouts: { include: { categories: true } },
      },
    });

    if (!plan) throw new ForbiddenException('Acces denied.');

    return plan;
  }

  @Post()
  async create(@Body() createPlanInput: Plan) {
    return await this.prismaService.plan.create({
      data: createPlanInput,
      include: {
        user: true,
        workouts: { include: { categories: true } },
      },
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePlanInput: Plan) {
    const plan = await this.prismaService.plan.findUnique({
      where: { id },
      include: {
        user: true,
        workouts: { include: { categories: true } },
      },
    });

    if (!plan) throw new ForbiddenException('Access denied.');

    return await this.prismaService.plan.update({
      where: { id: plan.id },
      data: updatePlanInput,
      include: {
        user: true,
        workouts: { include: { categories: true } },
      },
    });
  }

  @Delete(':id')
  // @Permit(PermissionType.UserManagement)
  async remove(@Param('id') id: string) {
    return await this.prismaService.plan.delete({
      where: { id },
      include: {
        user: true,
        workouts: { include: { categories: true } },
      },
    });
  }
}
