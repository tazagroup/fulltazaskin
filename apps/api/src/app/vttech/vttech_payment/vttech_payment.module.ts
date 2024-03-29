import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VttechpaymentEntity } from './entities/vttech_payment.entity';
import { VttechpaymentController } from './vttech_payment.controller';
import { VttechpaymentService } from './vttech_payment.service';
@Module({
  imports: [TypeOrmModule.forFeature([VttechpaymentEntity])],
  controllers: [VttechpaymentController],
  providers: [VttechpaymentService],
  exports: [VttechpaymentService]
})
export class VttechpaymentModule {}
