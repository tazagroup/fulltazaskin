import { Module } from '@nestjs/common';
import { ZnsdieutriService } from './znsdieutri.service';
import { ZnsdieutriController } from './znsdieutri.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZnsdieutriEntity } from './entities/znsdieutri.entity';
import { VttechdieutriService } from '../../vttech/vttechdieutri/vttechdieutri.service';
import { VttechdieutriModule } from '../../vttech/vttechdieutri/vttechdieutri.module';
import { TelegramService } from '../../shared/telegram.service';
import { ChinhanhModule } from '../../cauhinh/chinhanh/chinhanh.module';
import { ZaloznstrackingModule } from '../../zalo/zaloznstracking/zaloznstracking.module';
import { LoggerModule } from '../../logger/logger.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([ZnsdieutriEntity]),
    VttechdieutriModule,
    ChinhanhModule,
    ZaloznstrackingModule,
    LoggerModule
  ],
  controllers: [ZnsdieutriController],
  providers: [ZnsdieutriService,TelegramService],
  exports: [ZnsdieutriService]
})
export class ZnsdieutriModule {}



