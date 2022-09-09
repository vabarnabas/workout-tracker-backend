import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CollectionController } from './collection.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CollectionController],
})
export class CollectionModule {}
