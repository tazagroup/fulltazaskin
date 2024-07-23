import { Module } from '@nestjs/common';
import { VttechdieutriService } from './vttechdieutri.service';
import { VttechdieutriController } from './vttechdieutri.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VttechdieutriEntity } from './entities/vttechdieutri.entity';
import { SharedService } from '../../shared/shared.service';
import { ChinhanhModule } from '../../cauhinh/chinhanh/chinhanh.module';
import { LoggerModule } from '../../logger/logger.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([VttechdieutriEntity]),
    ChinhanhModule,
    LoggerModule
  ],
  controllers: [VttechdieutriController],
  providers: [VttechdieutriService,SharedService],
  exports: [VttechdieutriService]
})
export class VttechdieutriModule {}



