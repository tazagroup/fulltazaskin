import { Module } from '@nestjs/common';
import { ZalodanhgiaService } from './zalodanhgia.service';
import { ZalodanhgiaController } from './zalodanhgia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZalodanhgiaEntity } from './entities/zalodanhgia.entity';
import { ZaloznstrackingModule } from '../zaloznstracking/zaloznstracking.module';
import { LoggerModule } from '../../logger/logger.module';
@Module({
  imports: [TypeOrmModule.forFeature([ZalodanhgiaEntity]),ZaloznstrackingModule,LoggerModule],
  controllers: [ZalodanhgiaController],
  providers: [ZalodanhgiaService],
  exports: [ZalodanhgiaService],
})
export class ZalodanhgiaModule {}
