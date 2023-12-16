import { Module } from '@nestjs/common';
import { ZaloService } from './zalo.service';
import { ZaloController } from './zalo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZaloEntity } from './zalo.entity';
import { ZaloznsModule } from './zalozns/zalozns.module';
import { ZalotokenModule } from './zalotoken/zalotoken.module';
@Module({
  imports: [TypeOrmModule.forFeature([ZaloEntity]), ZaloznsModule, ZalotokenModule],
  controllers: [ZaloController],
  providers: [ZaloService]
})
export class ZaloModule {}
