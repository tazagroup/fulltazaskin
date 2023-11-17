import { Module } from '@nestjs/common';
import { KhachhangService } from './khachhang.service';
import { KhachhangController } from './khachhang.controller';
import { KhachhangEntity } from './entities/khachhang.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CauhinhModule } from '../cauhinh/cauhinh.module';
import { KhachhangchitietModule } from './khachhangchitiet/khachhangchitiet.module';
import { ChitietModule } from './chitiet/chitiet.module';
import { KhachhangsModule } from './khachhang/khachhang.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([KhachhangEntity]),
    CauhinhModule,
    KhachhangchitietModule,
    ChitietModule,
    KhachhangsModule
],
  controllers: [KhachhangController],
  providers: [KhachhangService],
  exports:[KhachhangService]
})
export class KhachhangModule {}
