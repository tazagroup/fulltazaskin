import { Module } from '@nestjs/common';
import { KhachhangdichvuService } from './khachhangdichvu.service';
import { KhachhangdichvuController } from './khachhangdichvu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KhachhangdichvuEntity } from './entities/khachhangdichvu.entity';
import { KhachhangsModule } from '../khachhang/khachhang.module';
@Module({
  imports: [TypeOrmModule.forFeature([KhachhangdichvuEntity]),KhachhangsModule],
  controllers: [KhachhangdichvuController],
  providers: [KhachhangdichvuService]
})
export class KhachhangdichvuModule {}
