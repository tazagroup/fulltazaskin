import { Module } from '@nestjs/common';
import { ZnsthanhtoanService } from './znsthanhtoan.service';
import { ZnsthanhtoanController } from './znsthanhtoan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZnsthanhtoanEntity } from './entities/znsthanhtoan.entity';
import { VttechthanhtoanModule } from '../../vttech/vttechthanhtoan/vttechthanhtoan.module';
import { TelegramService } from '../../shared/telegram.service';
import { ChinhanhModule } from '../../cauhinh/chinhanh/chinhanh.module';
import { ZaloznstrackingModule } from '../../zalo/zaloznstracking/zaloznstracking.module';
import { LoggerModule } from '../../logger/logger.module';
import { RediscacheService } from '../../rediscache.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([ZnsthanhtoanEntity]),
    VttechthanhtoanModule,
    ChinhanhModule,
    ZaloznstrackingModule,
    LoggerModule
  ],
  controllers: [ZnsthanhtoanController],
  providers: [ZnsthanhtoanService,TelegramService,RediscacheService]
})
export class ZnsthanhtoanModule {}



