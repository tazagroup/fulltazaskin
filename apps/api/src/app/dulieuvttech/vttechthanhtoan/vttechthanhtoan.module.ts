import { Module } from '@nestjs/common';
import { VttechthanhtoanService } from './vttechthanhtoan.service';
import { VttechthanhtoanController } from './vttechthanhtoan.controller';

@Module({
  controllers: [VttechthanhtoanController],
  providers: [VttechthanhtoanService]
})
export class VttechthanhtoanModule {}
