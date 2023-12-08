import { Module } from '@nestjs/common';
import { KhuyenmaiService } from './khuyenmai.service';
import { KhuyenmaiController } from './khuyenmai.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KhuyenmaiEntity } from './entities/khuyenmai.entity';
@Module({
  imports: [TypeOrmModule.forFeature([KhuyenmaiEntity])],
  controllers: [KhuyenmaiController],
  providers: [KhuyenmaiService]
})
export class KhuyenmaiModule {}
