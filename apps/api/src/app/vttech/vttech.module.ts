import { Module } from '@nestjs/common';
import { VttechService } from './vttech.service';
import { VttechController } from './vttech.controller';

import { CauhinhchungModule } from '../cauhinh/cauhinhchung/cauhinhchung.module';
import { ZaloznsModule } from '../zalo/zalozns/zalozns.module';
import { LoggerModule } from '../logger/logger.module';
import { VttechthanhtoanModule } from './vttechthanhtoan/vttechthanhtoan.module';

import { VttechlichhenModule } from './vttechlichhen/vttechlichhen.module';
import { VttechlichsuthanhtoanModule } from './vttechlichsuthanhtoan/vttechlichsuthanhtoan.module';
import { VttechlieutrinhModule } from './vttechlieutrinh/vttechlieutrinh.module';
import { VttechdieutriModule } from './vttechdieutri/vttechdieutri.module';
import { VttechkhachhangModule } from './vttechkhachhang/vttechkhachhang.module';
@Module({
  imports: [
    CauhinhchungModule,
    ZaloznsModule,
    LoggerModule,
    VttechthanhtoanModule,
    VttechlichhenModule,
    VttechlichsuthanhtoanModule,
    VttechlieutrinhModule,
    VttechdieutriModule,
    VttechkhachhangModule,
  ],
  controllers: [VttechController],
  providers: [VttechService],

})
export class VttechModule {}
