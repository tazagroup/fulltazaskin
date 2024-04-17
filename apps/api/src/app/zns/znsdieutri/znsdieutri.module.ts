import { Module } from '@nestjs/common';
import { ZnsdieutriService } from './znsdieutri.service';
import { ZnsdieutriController } from './znsdieutri.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZnsdieutriEntity } from './entities/znsdieutri.entity';
import { VttechthanhtoanService } from '../../vttech/vttechthanhtoan/vttechthanhtoan.service';
import { VttechthanhtoanModule } from '../../vttech/vttechthanhtoan/vttechthanhtoan.module';
import { TelegramService } from '../../shared/telegram.service';
import { ChinhanhModule } from '../../cauhinh/chinhanh/chinhanh.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([ZnsdieutriEntity]),
    VttechthanhtoanModule,
    ChinhanhModule,
  ],
  controllers: [ZnsdieutriController],
  providers: [ZnsdieutriService,TelegramService]
})
export class ZnsdieutriModule {}



