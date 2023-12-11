import { Module } from '@nestjs/common';
import { ZaloznsService } from './zalozns.service';
import { ZaloznsController } from './zalozns.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZaloznsEntity } from './entities/zalozns.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ZaloznsEntity])],
  controllers: [ZaloznsController],
  providers: [ZaloznsService]
})
export class ZaloznsModule {}
