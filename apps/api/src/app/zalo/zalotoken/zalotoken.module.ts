import { Module } from '@nestjs/common';
import { ZalotokenService } from './zalotoken.service';
import { ZalotokenController } from './zalotoken.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZalotokenEntity } from './entities/zalotoken.entity';
import { ChinhanhModule } from '../../cauhinh/chinhanh/chinhanh.module';
import { LoggerModule } from '../../logger/logger.module';
@Module({
  imports: [
  TypeOrmModule.forFeature([ZalotokenEntity]),
  ChinhanhModule,
  LoggerModule
],
  controllers: [ZalotokenController],
  providers: [ZalotokenService],
  exports: [ZalotokenService],
})
export class ZalotokenModule {}
