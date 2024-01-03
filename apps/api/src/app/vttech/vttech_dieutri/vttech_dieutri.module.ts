import { Module } from '@nestjs/common';
import { Vttech_dieutriService } from './vttech_dieutri.service';
import { Vttech_dieutriController } from './vttech_dieutri.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vttech_dieutriEntity } from './entities/vttech_dieutri.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Vttech_dieutriEntity])],
  controllers: [Vttech_dieutriController],
  providers: [Vttech_dieutriService],
  exports: [Vttech_dieutriService]
})
export class Vttech_dieutriModule {}
