import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { PlanModule } from './plan/plan.module';
import { WorkoutModule } from './workout/workout.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { AtGuard, PermissionGuard } from './common/guards';
import { APP_GUARD } from '@nestjs/core';
import { SearchModule } from './search/search.module';
import { CollectionController } from './collection/collection.controller';
import { CollectionModule } from './collection/collection.module';
import { PostController } from './post/post.controller';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    PlanModule,
    WorkoutModule,
    CategoryModule,
    AuthModule,
    SearchModule,
    CollectionModule,
    PostModule,
  ],
  controllers: [AppController, CollectionController, PostController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
