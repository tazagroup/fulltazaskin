import { Module } from '@nestjs/common';
import { CauhinhService } from './cauhinh.service';
import { CauhinhController } from './cauhinh.controller';
import { CauhinhEntity } from './entities/cauhinh.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DichvuModule } from './dichvu/dichvu.module';
@Module({
  imports: [TypeOrmModule.forFeature([CauhinhEntity]), DichvuModule],
  controllers: [CauhinhController],
  providers: [CauhinhService],
  exports:[CauhinhService]
})
export class CauhinhModule {}
