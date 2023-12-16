import { Module } from '@nestjs/common';
import { ZalotokenService } from './zalotoken.service';
import { ZalotokenController } from './zalotoken.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZalotokenEntity } from './entities/zalotoken.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ZalotokenEntity])],
  controllers: [ZalotokenController],
  providers: [ZalotokenService],
  exports: [ZalotokenService],
})
export class ZalotokenModule {}
