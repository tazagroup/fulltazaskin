import { Module } from '@nestjs/common';
import { ZnsdieutriService } from './znsdieutri.service';
import { ZnsdieutriController } from './znsdieutri.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZnsdieutriEntity } from './entities/znsdieutri.entity';
import { VttechdieutriService } from '../../vttech/vttechdieutri/vttechdieutri.service';
import { VttechdieutriModule } from '../../vttech/vttechdieutri/vttechdieutri.module';
import { ChinhanhModule } from '../../cauhinh/chinhanh/chinhanh.module';
import { ZaloznstrackingModule } from '../../zalo/zaloznstracking/zaloznstracking.module';
import { LoggerModule } from '../../logger/logger.module';
import { RediscacheService } from '../../rediscache.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([ZnsdieutriEntity]),
    VttechdieutriModule,
    ChinhanhModule,
    ZaloznstrackingModule,
    LoggerModule
  ],
  controllers: [ZnsdieutriController],
  providers: [ZnsdieutriService,RediscacheService],
  exports: [ZnsdieutriService]
})
export class ZnsdieutriModule {}



