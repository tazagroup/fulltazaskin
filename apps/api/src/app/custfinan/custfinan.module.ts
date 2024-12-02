import { Module } from '@nestjs/common';
import { CustfinanService } from './custfinan.service';
import { CustfinanController } from './custfinan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustfinanEntity } from './entities/custfinan.entity';
import { VttechlichhenModule } from '../vttech/vttechlichhen/vttechlichhen.module';
import { VttechdieutriModule } from '../vttech/vttechdieutri/vttechdieutri.module';
import { VttechthanhtoanModule } from '../vttech/vttechthanhtoan/vttechthanhtoan.module';
import { VttechkhachhangModule } from '../vttech/vttechkhachhang/vttechkhachhang.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([CustfinanEntity]),
    VttechlichhenModule,
    VttechdieutriModule,
    VttechthanhtoanModule,
    VttechkhachhangModule
  ],
  controllers: [CustfinanController],
  providers: [CustfinanService]
})
export class CustfinanModule {}
