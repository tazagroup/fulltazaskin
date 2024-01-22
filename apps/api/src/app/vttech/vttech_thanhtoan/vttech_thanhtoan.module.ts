import { Module } from '@nestjs/common';
import { Vttech_thanhtoanService } from './vttech_thanhtoan.service';
import { Vttech_thanhtoanController } from './vttech_thanhtoan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vttech_thanhtoanEntity } from './entities/vttech_thanhtoan.entity';
import { CauhinhchungModule } from '../../cauhinh/cauhinhchung/cauhinhchung.module';
import { TelegramService } from '../../shared/telegram.service';
import { ZaloznsModule } from '../../zalo/zalozns/zalozns.module';
import { LoggerModule } from '../../logger/logger.module';
@Module({
  imports: [TypeOrmModule.forFeature([Vttech_thanhtoanEntity]),
  CauhinhchungModule,
  ZaloznsModule,
  LoggerModule
],
  controllers: [Vttech_thanhtoanController],
  providers: [Vttech_thanhtoanService,TelegramService],
  exports:[Vttech_thanhtoanService]
})
export class Vttech_thanhtoanModule {}
