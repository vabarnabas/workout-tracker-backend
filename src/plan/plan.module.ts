import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PlanController } from './plan.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PlanController],
})
export class PlanModule {}
