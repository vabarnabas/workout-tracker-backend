import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('search')
export class SearchController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get(':query')
  async search(@Param('query') query: string) {
    const searchUsers = await this.prismaService.user.findMany({
      where: {
        OR: [
          { displayName: { contains: query } },
          { handle: { contains: query } },
        ],
      },
    });
    const userResults = searchUsers.map((user) => {
      return { id: user.id, displayName: user.displayName, group: 'User' };
    });
    const searchPlans = await this.prismaService.plan.findMany({
      where: { displayName: { contains: query } },
    });
    const planResults = searchPlans.map((plan) => {
      return { id: plan.id, displayName: plan.displayName, group: 'Plan' };
    });
    const searchWorkouts = await this.prismaService.workout.findMany({
      where: { displayName: { contains: query } },
    });
    const workoutResults = searchWorkouts.map((workout) => {
      return {
        id: workout.id,
        displayName: workout.displayName,
        group: 'Workout',
      };
    });

    return [...workoutResults, ...planResults, ...userResults];
  }
}
