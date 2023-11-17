import { Module } from '@nestjs/common';
import { KhachhangService } from './khachhang.service';
import { KhachhangController } from './khachhang.controller';
import { KhachhangEntity } from './entities/khachhang.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([KhachhangEntity])],
  controllers: [KhachhangController],
  providers: [KhachhangService]
})
export class KhachhangsModule {}
