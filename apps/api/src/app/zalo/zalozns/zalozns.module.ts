import { Module } from '@nestjs/common';
import { ZaloznsService } from './zalozns.service';
import { ZaloznsController } from './zalozns.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZaloznsEntity } from './entities/zalozns.entity';
import { CauhinhchungModule } from '../../cauhinh/cauhinhchung/cauhinhchung.module';
import { ZalotokenModule } from '../zalotoken/zalotoken.module';
import { HttpModule } from '@nestjs/axios';
import { SmsModule } from '../../sms/sms.module';
import { TelegramService } from '../../shared/telegram.service';
import { ZalodanhgiaModule } from '../zalodanhgia/zalodanhgia.module';
import { ZaloznstrackingModule } from '../zaloznstracking/zaloznstracking.module';
import { LoggerModule } from '../../logger/logger.module';
@Module({
  imports: [TypeOrmModule.forFeature([ZaloznsEntity]),
  CauhinhchungModule,
  ZalotokenModule,
  HttpModule,
  SmsModule,
  ZalodanhgiaModule,
  ZaloznstrackingModule,
  LoggerModule
],
  controllers: [ZaloznsController],
  providers: [ZaloznsService,TelegramService],
  exports: [ZaloznsService]
})
export class ZaloznsModule {}
