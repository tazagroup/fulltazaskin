import { Module } from '@nestjs/common';
import { ChitietService } from './chitiet.service';
import { ChitietController } from './chitiet.controller';
import { ChitietEntity } from './entities/chitiet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([ChitietEntity])],
  controllers: [ChitietController],
  providers: [ChitietService]
})
export class ChitietModule {}
