import { Module } from '@nestjs/common';
import { ZaloService } from './zalo.service';
import { ZaloController } from './zalo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZaloEntity } from './zalo.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ZaloEntity])],
  controllers: [ZaloController],
  providers: [ZaloService]
})
export class ZaloModule {}
