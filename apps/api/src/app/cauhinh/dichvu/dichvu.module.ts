import { Module } from '@nestjs/common';
import { DichvuService } from './dichvu.service';
import { DichvuController } from './dichvu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DichvuEntity } from './entities/dichvu.entity';
@Module({
  imports: [TypeOrmModule.forFeature([DichvuEntity])],
  controllers: [DichvuController],
  providers: [DichvuService]
})
export class DichvuModule {}
