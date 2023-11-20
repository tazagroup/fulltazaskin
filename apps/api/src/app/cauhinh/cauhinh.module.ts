import { Module } from '@nestjs/common';
import { CauhinhService } from './cauhinh.service';
import { CauhinhController } from './cauhinh.controller';
import { CauhinhEntity } from './entities/cauhinh.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HangthanhvienModule } from './hangthanhvien/hangthanhvien.module';
import { ChinhanhModule } from './chinhanh/chinhanh.module';
@Module({
  imports: [TypeOrmModule.forFeature([CauhinhEntity]), HangthanhvienModule, ChinhanhModule],
  controllers: [CauhinhController],
  providers: [CauhinhService],
  exports:[CauhinhService]
})
export class CauhinhModule {}
