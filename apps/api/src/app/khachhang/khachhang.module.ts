import { Module } from '@nestjs/common';
import { KhachhangService } from './khachhang.service';
import { KhachhangController } from './khachhang.controller';
import { KhachhangEntity } from './entities/khachhang.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CauhinhModule } from '../cauhinh/cauhinh.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([KhachhangEntity]),
    CauhinhModule
],
  controllers: [KhachhangController],
  providers: [KhachhangService],
  exports:[KhachhangService]
})
export class KhachhangModule {}
