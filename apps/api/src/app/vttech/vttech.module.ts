import { Module } from '@nestjs/common';
import { VttechService } from './vttech.service';
import { VttechController } from './vttech.controller';
import { Vttech_khachhangModule } from './vttech_khachhang/vttech_khachhang.module';
import { TelegramService } from '../shared/telegram.service';
import { CauhinhchungService } from '../cauhinh/cauhinhchung/cauhinhchung.service';
import { CauhinhchungModule } from '../cauhinh/cauhinhchung/cauhinhchung.module';
@Module({
  imports: [Vttech_khachhangModule,CauhinhchungModule],
  controllers: [VttechController],
  providers: [VttechService,TelegramService]

})
export class VttechModule {}
