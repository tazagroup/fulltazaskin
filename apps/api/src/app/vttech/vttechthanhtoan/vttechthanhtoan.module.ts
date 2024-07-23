import { Module } from '@nestjs/common';
import { VttechthanhtoanService } from './vttechthanhtoan.service';
import { VttechthanhtoanController } from './vttechthanhtoan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VttechthanhtoanEntity } from './entities/vttechthanhtoan.entity';
import { SharedService } from '../../shared/shared.service';
import { LoggerModule } from '../../logger/logger.module';
@Module({
  imports: [TypeOrmModule.forFeature([VttechthanhtoanEntity]),
  LoggerModule
],
  controllers: [VttechthanhtoanController],
  providers: [VttechthanhtoanService,SharedService],
  exports: [VttechthanhtoanService]
})
export class VttechthanhtoanModule {}
