import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostController } from './post.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PostController],
})
export class PostModule {}
