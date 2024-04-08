import { Module } from '@nestjs/common';
import { VttechlieutrinhService } from './vttechlieutrinh.service';
import { VttechlieutrinhController } from './vttechlieutrinh.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VttechlieutrinhEntity } from './entities/vttechlieutrinh.entity';
@Module({
  imports: [TypeOrmModule.forFeature([VttechlieutrinhEntity])],
  controllers: [VttechlieutrinhController],
  providers: [VttechlieutrinhService],
  exports: [VttechlieutrinhService],
})
export class VttechlieutrinhModule {}
