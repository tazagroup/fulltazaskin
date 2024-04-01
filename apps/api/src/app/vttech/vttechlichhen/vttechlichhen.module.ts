import { Module } from '@nestjs/common';
import { VttechlichhenService } from './vttechlichhen.service';
import { VttechlichhenController } from './vttechlichhen.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VttechlichhenEntity } from './entities/vttechlichhen.entity';
@Module({
  imports: [TypeOrmModule.forFeature([VttechlichhenEntity])],
  controllers: [VttechlichhenController],
  providers: [VttechlichhenService],
  exports: [VttechlichhenService],
})
export class VttechlichhenModule {}

