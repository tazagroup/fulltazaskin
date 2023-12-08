import { Module } from '@nestjs/common';
import { LichhenService } from './lichhen.service';
import { LichhenController } from './lichhen.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LichhenEntity } from './entities/lichhen.entity';
@Module({
  imports: [TypeOrmModule.forFeature([LichhenEntity])],
  controllers: [LichhenController],
  providers: [LichhenService]
})
export class LichhenModule {}
