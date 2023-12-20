import { Module } from '@nestjs/common';
import { VttechService } from './vttech.service';
import { VttechController } from './vttech.controller';

@Module({
  controllers: [VttechController],
  providers: [VttechService],
  exports:[VttechService],
})
export class VttechModule {}
