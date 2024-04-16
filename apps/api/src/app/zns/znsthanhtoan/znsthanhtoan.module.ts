import { Module } from '@nestjs/common';
import { ZnsthanhtoanService } from './znsthanhtoan.service';
import { ZnsthanhtoanController } from './znsthanhtoan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZnsthanhtoanEntity } from './entities/znsthanhtoan.entity';
import { VttechthanhtoanService } from '../../vttech/vttechthanhtoan/vttechthanhtoan.service';
import { VttechthanhtoanModule } from '../../vttech/vttechthanhtoan/vttechthanhtoan.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([ZnsthanhtoanEntity]),
    VttechthanhtoanModule
  ],
  controllers: [ZnsthanhtoanController],
  providers: [ZnsthanhtoanService]
})
export class ZnsthanhtoanModule {}



