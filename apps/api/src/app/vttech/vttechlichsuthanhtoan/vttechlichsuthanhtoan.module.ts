import { Module } from '@nestjs/common';
import { VttechlichsuthanhtoanService } from './vttechlichsuthanhtoan.service';
import { VttechlichsuthanhtoanController } from './vttechlichsuthanhtoan.controller';

@Module({
  controllers: [VttechlichsuthanhtoanController],
  providers: [VttechlichsuthanhtoanService]
})
export class VttechlichsuthanhtoanModule {}
