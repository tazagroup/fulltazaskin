import { Module } from '@nestjs/common';
import { ZaloappuudaiService } from './zaloappuudai.service';
import { ZaloappuudaiController } from './zaloappuudai.controller';

@Module({
  controllers: [ZaloappuudaiController],
  providers: [ZaloappuudaiService]
})
export class ZaloappuudaiModule {}
