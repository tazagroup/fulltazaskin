import { Module } from '@nestjs/common';
import { CauhinhService } from './cauhinh.service';
import { CauhinhController } from './cauhinh.controller';
import { CauhinhEntity } from './entities/cauhinh.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HangthanhvienModule } from './hangthanhvien/hangthanhvien.module';
@Module({
  imports: [TypeOrmModule.forFeature([CauhinhEntity]), HangthanhvienModule],
  controllers: [CauhinhController],
  providers: [CauhinhService],
  exports:[CauhinhService]
})
export class CauhinhModule {}
