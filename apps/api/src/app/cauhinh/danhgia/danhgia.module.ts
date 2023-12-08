import { Module } from '@nestjs/common';
import { DanhgiaService } from './danhgia.service';
import { DanhgiaController } from './danhgia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DanhgiaEntity } from './entities/danhgia.entity';
@Module({
  imports: [TypeOrmModule.forFeature([DanhgiaEntity])],
  controllers: [DanhgiaController],
  providers: [DanhgiaService]
})
export class DanhgiaModule {}
