import { Module } from '@nestjs/common';
import { DanhmucService } from './danhmuc.service';
import { DanhmucController } from './danhmuc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DanhmucEntity } from './entities/danhmuc.entity';
@Module({
  imports: [TypeOrmModule.forFeature([DanhmucEntity])],
  controllers: [DanhmucController],
  providers: [DanhmucService]
})
export class DanhmucModule {}
