import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { PlanModule } from './plan/plan.module';
import { WorkoutModule } from './workout/workout.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    PlanModule,
    WorkoutModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
