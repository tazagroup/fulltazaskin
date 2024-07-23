import { Module } from '@nestjs/common';
import { VttechlichhenService } from './vttechlichhen.service';
import { VttechlichhenController } from './vttechlichhen.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VttechlichhenEntity } from './entities/vttechlichhen.entity';
import { SharedService } from '../../shared/shared.service';
import { LoggerModule } from '../../logger/logger.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([VttechlichhenEntity]),
    LoggerModule
  ],
  controllers: [VttechlichhenController],
  providers: [VttechlichhenService,SharedService],
  exports: [VttechlichhenService],
})
export class VttechlichhenModule {}

