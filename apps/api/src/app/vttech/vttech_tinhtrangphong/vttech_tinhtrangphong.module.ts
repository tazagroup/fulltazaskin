import { Module } from '@nestjs/common';
import { Vttech_tinhtrangphongService } from './vttech_tinhtrangphong.service';
import { Vttech_tinhtrangphongController } from './vttech_tinhtrangphong.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vttech_tinhtrangphongEntity } from './entities/vttech_tinhtrangphong.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Vttech_tinhtrangphongEntity])],
  controllers: [Vttech_tinhtrangphongController],
  providers: [Vttech_tinhtrangphongService],
  exports: [Vttech_tinhtrangphongService],
})
export class Vttech_tinhtrangphongModule {}
