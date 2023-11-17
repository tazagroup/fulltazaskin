import { Module } from '@nestjs/common';
import { KhachhangchitietService } from './khachhangchitiet.service';
import { KhachhangchitietController } from './khachhangchitiet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KhachhangchitietEntity } from './entities/khachhangchitiet.entity';
@Module({
  imports: [TypeOrmModule.forFeature([KhachhangchitietEntity])],
  controllers: [KhachhangchitietController],
  providers: [KhachhangchitietService]
})
export class KhachhangchitietModule {}
