import { Module } from '@nestjs/common';
import { ZnsdieutriService } from './znsdieutri.service';
import { ZnsdieutriController } from './znsdieutri.controller';

@Module({
  controllers: [ZnsdieutriController],
  providers: [ZnsdieutriService]
})
export class ZnsdieutriModule {}
