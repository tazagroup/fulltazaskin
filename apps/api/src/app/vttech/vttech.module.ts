import { Module } from '@nestjs/common';
import { VttechService } from './vttech.service';
import { VttechController } from './vttech.controller';
import { Vttech_khachhangModule } from './vttech_khachhang/vttech_khachhang.module';
import { TelegramService } from '../shared/telegram.service';
import { CauhinhchungService } from '../cauhinh/cauhinhchung/cauhinhchung.service';
import { CauhinhchungModule } from '../cauhinh/cauhinhchung/cauhinhchung.module';
import { Vttech_tinhtrangphongModule } from './vttech_tinhtrangphong/vttech_tinhtrangphong.module';
import { Vttech_dieutriModule } from './vttech_dieutri/vttech_dieutri.module';
import { Vttech_tinhtrangphongService } from './vttech_tinhtrangphong/vttech_tinhtrangphong.service';
@Module({
  imports: [Vttech_khachhangModule,CauhinhchungModule,Vttech_tinhtrangphongModule,Vttech_dieutriModule],
  controllers: [VttechController],
  providers: [VttechService,TelegramService]

})
export class VttechModule {}
