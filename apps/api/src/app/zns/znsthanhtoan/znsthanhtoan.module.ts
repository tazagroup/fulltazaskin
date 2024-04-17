import { Module } from '@nestjs/common';
import { ZnsthanhtoanService } from './znsthanhtoan.service';
import { ZnsthanhtoanController } from './znsthanhtoan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZnsthanhtoanEntity } from './entities/znsthanhtoan.entity';
import { VttechthanhtoanService } from '../../vttech/vttechthanhtoan/vttechthanhtoan.service';
import { VttechthanhtoanModule } from '../../vttech/vttechthanhtoan/vttechthanhtoan.module';
import { TelegramService } from '../../shared/telegram.service';
import { ChinhanhModule } from '../../cauhinh/chinhanh/chinhanh.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([ZnsthanhtoanEntity]),
    VttechthanhtoanModule,
    ChinhanhModule,
  ],
  controllers: [ZnsthanhtoanController],
  providers: [ZnsthanhtoanService,TelegramService]
})
export class ZnsthanhtoanModule {}



