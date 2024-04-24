import { Module } from '@nestjs/common';
import { ZalotokenService } from './zalotoken.service';
import { ZalotokenController } from './zalotoken.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZalotokenEntity } from './entities/zalotoken.entity';
import { ChinhanhModule } from '../../cauhinh/chinhanh/chinhanh.module';
import { TelegramService } from '../../shared/telegram.service';
@Module({
  imports: [TypeOrmModule.forFeature([ZalotokenEntity]),ChinhanhModule],
  controllers: [ZalotokenController],
  providers: [ZalotokenService,TelegramService],
  exports: [ZalotokenService],
})
export class ZalotokenModule {}
