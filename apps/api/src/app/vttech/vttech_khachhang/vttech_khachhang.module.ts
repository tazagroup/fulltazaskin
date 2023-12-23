import { Module } from '@nestjs/common';
import { Vttech_khachhangService } from './vttech_khachhang.service';
import { Vttech_khachhangController } from './vttech_khachhang.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vttech_khachhangEntity } from './entities/vttech_khachhang.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Vttech_khachhangEntity])],
  controllers: [Vttech_khachhangController],
  providers: [Vttech_khachhangService],
  exports: [Vttech_khachhangService]
})
export class Vttech_khachhangModule {}
