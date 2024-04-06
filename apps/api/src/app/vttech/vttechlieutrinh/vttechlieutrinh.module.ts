import { Module } from '@nestjs/common';
import { VttechlieutrinhService } from './vttechlieutrinh.service';
import { VttechlieutrinhController } from './vttechlieutrinh.controller';

@Module({
  controllers: [VttechlieutrinhController],
  providers: [VttechlieutrinhService]
})
export class VttechlieutrinhModule {}
