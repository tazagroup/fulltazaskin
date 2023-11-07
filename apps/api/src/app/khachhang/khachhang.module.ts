import { Module } from '@nestjs/common';
import { KhachhangService } from './khachhang.service';
import { KhachhangController } from './khachhang.controller';

@Module({
  controllers: [KhachhangController],
  providers: [KhachhangService],
  exports:[KhachhangService]
})
export class KhachhangModule {}
