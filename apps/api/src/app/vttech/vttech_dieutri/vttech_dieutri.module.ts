import { Module } from '@nestjs/common';
import { Vttech_dieutriService } from './vttech_dieutri.service';
import { Vttech_dieutriController } from './vttech_dieutri.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vttech_dieutriEntity } from './entities/vttech_dieutri.entity';
import { CauhinhchungModule } from '../../cauhinh/cauhinhchung/cauhinhchung.module';
import { ZaloznsModule } from '../../zalo/zalozns/zalozns.module';
import { LoggerModule } from '../../logger/logger.module';
import { TelegramService } from '../../shared/telegram.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Vttech_dieutriEntity]),
    CauhinhchungModule,
    ZaloznsModule,
    LoggerModule
],
  controllers: [Vttech_dieutriController],
  providers: [Vttech_dieutriService,TelegramService],
  exports: [Vttech_dieutriService]
})
export class Vttech_dieutriModule {}
