import { Module } from '@nestjs/common';
import { ZaloService } from './zalo.service';
import { ZaloController } from './zalo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZaloEntity } from './zalo.entity';
import { ZaloznsModule } from './zalozns/zalozns.module';
import { ZalotokenModule } from './zalotoken/zalotoken.module';
import { ZalodanhgiaModule } from './zalodanhgia/zalodanhgia.module';
import { ZaloznstrackingModule } from './zaloznstracking/zaloznstracking.module';
@Module({
  imports: [TypeOrmModule.forFeature([ZaloEntity]), ZaloznsModule, ZalotokenModule, ZalodanhgiaModule, ZaloznstrackingModule],
  controllers: [ZaloController],
  providers: [ZaloService]
})
export class ZaloModule {}
