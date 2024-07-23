import { Module } from '@nestjs/common';
import { ZalominiappService } from './zalominiapp.service';
import { ZalominiappController } from './zalominiapp.controller';
import { CauhinhchungModule } from '../cauhinh/cauhinhchung/cauhinhchung.module';
@Module({
  imports: [CauhinhchungModule],
  controllers: [ZalominiappController],
  providers: [ZalominiappService]
})
export class ZalominiappModule {}



