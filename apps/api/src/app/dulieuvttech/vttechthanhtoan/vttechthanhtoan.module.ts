import { Module } from '@nestjs/common';
import { VttechthanhtoanService } from './vttechthanhtoan.service';
import { VttechthanhtoanController } from './vttechthanhtoan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VttechthanhtoanEntity } from './entities/vttechthanhtoan.entity';
import { CauhinhchungModule } from '../../cauhinh/cauhinhchung/cauhinhchung.module';
@Module({
  imports: [TypeOrmModule.forFeature([VttechthanhtoanEntity]),
  CauhinhchungModule
],
  controllers: [VttechthanhtoanController],
  providers: [VttechthanhtoanService]
})
export class VttechthanhtoanModule {}
