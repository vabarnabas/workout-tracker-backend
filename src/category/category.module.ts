import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoryController } from './category.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CategoryController],
})
export class CategoryModule {}
