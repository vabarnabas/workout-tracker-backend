import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WorkoutController } from './workout.controller';

@Module({
  imports: [PrismaModule],
  controllers: [WorkoutController],
})
export class WorkoutModule {}
