import { Module } from '@nestjs/common';
import { VttechthanhtoanService } from './vttechthanhtoan.service';
import { VttechthanhtoanController } from './vttechthanhtoan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VttechthanhtoanEntity } from './entities/vttechthanhtoan.entity';
import { CauhinhchungModule } from '../../cauhinh/cauhinhchung/cauhinhchung.module';
import { TelegramService } from '../../shared/telegram.service';
import { ZaloznsModule } from '../../zalo/zalozns/zalozns.module';
import { VttechthanhtoanZNSEntity } from './entities/vttechthanhtoan-zns.entity';
import { LoggerModule } from '../../logger/logger.module';
@Module({
  imports: [TypeOrmModule.forFeature([VttechthanhtoanEntity,VttechthanhtoanZNSEntity]),
  CauhinhchungModule,
  ZaloznsModule,
  LoggerModule
 // TasksModule
],
  controllers: [VttechthanhtoanController],
  providers: [VttechthanhtoanService,TelegramService],
  exports:[VttechthanhtoanService]
})
export class VttechthanhtoanModule {}
