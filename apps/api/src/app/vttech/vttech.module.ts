import { Module } from '@nestjs/common';
import { VttechService } from './vttech.service';
import { VttechController } from './vttech.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vttech_khachhangEntity } from './entities/vttech.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Vttech_khachhangEntity])],
  controllers: [VttechController],
  providers: [VttechService]
})
export class VttechModule {}
