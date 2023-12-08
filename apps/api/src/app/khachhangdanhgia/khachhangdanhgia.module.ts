import { Module } from '@nestjs/common';
import { KhachhangdanhgiaService } from './khachhangdanhgia.service';
import { KhachhangdanhgiaController } from './khachhangdanhgia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KhachhangdanhgiaEntity } from './entities/khachhangdanhgia.entity';
@Module({
  imports: [TypeOrmModule.forFeature([KhachhangdanhgiaEntity])],
  controllers: [KhachhangdanhgiaController],
  providers: [KhachhangdanhgiaService]
})
export class KhachhangdanhgiaModule {}
