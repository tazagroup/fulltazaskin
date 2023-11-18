import { Module } from '@nestjs/common';
import { DanhmucService } from './danhmuc.service';
import { DanhmucController } from './danhmuc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DanhmucEntity } from './entities/danhmuc.entity';
import { DichvuModule } from '../dichvu/dichvu.module';
@Module({
  imports: [
  TypeOrmModule.forFeature([DanhmucEntity]),
  DichvuModule],
  controllers: [DanhmucController],
  providers: [DanhmucService]
})
export class DanhmucModule {}
