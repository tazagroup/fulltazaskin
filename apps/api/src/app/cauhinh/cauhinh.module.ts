import { Module } from '@nestjs/common';
import { CauhinhService } from './cauhinh.service';
import { CauhinhController } from './cauhinh.controller';
import { CauhinhEntity } from './entities/cauhinh.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([CauhinhEntity])],
  controllers: [CauhinhController],
  providers: [CauhinhService],
})
export class CauhinhModule {}
