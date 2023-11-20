import { Module } from '@nestjs/common';
import { ChinhanhService } from './chinhanh.service';
import { ChinhanhController } from './chinhanh.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChinhanhEntity } from './entities/chinhanh.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ChinhanhEntity])],
  controllers: [ChinhanhController],
  providers: [ChinhanhService]
})
export class ChinhanhModule {}
