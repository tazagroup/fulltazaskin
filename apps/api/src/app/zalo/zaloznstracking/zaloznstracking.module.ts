import { Module } from '@nestjs/common';
import { ZaloznstrackingService } from './zaloznstracking.service';
import { ZaloznstrackingController } from './zaloznstracking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZaloznstrackingEntity } from './entities/zaloznstracking.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ZaloznstrackingEntity])],
  controllers: [ZaloznstrackingController],
  providers: [ZaloznstrackingService],
  exports: [ZaloznstrackingService]
})
export class ZaloznstrackingModule {}
