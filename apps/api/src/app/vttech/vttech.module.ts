import { Module } from '@nestjs/common';
import { VttechService } from './vttech.service';
import { VttechController } from './vttech.controller';
import { Vttech_khachhangModule } from './vttech_khachhang/vttech_khachhang.module';
import { TelegramService } from '../shared/telegram.service';
import { CauhinhchungModule } from '../cauhinh/cauhinhchung/cauhinhchung.module';
import { Vttech_tinhtrangphongModule } from './vttech_tinhtrangphong/vttech_tinhtrangphong.module';
import { Vttech_dieutriModule } from './vttech_dieutri/vttech_dieutri.module';
import { ZaloznsModule } from '../zalo/zalozns/zalozns.module';
import { LoggerModule } from '../logger/logger.module';
import { VttechthanhtoanModule } from './vttechthanhtoan/vttechthanhtoan.module';
import { Vttech_thanhtoanModule } from './vttech_thanhtoan/vttech_thanhtoan.module';
@Module({
  imports: [
    Vttech_khachhangModule,
    CauhinhchungModule,
    Vttech_tinhtrangphongModule,
    Vttech_dieutriModule,
    ZaloznsModule,
    LoggerModule, 
    VttechthanhtoanModule,
    Vttech_thanhtoanModule
  ],
  controllers: [VttechController],
  providers: [VttechService,TelegramService]

})
export class VttechModule {}
