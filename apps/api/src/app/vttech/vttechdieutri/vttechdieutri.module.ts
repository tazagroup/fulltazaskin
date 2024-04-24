import { Module } from '@nestjs/common';
import { VttechdieutriService } from './vttechdieutri.service';
import { VttechdieutriController } from './vttechdieutri.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VttechdieutriEntity } from './entities/vttechdieutri.entity';
import { SharedService } from '../../shared/shared.service';
import { TelegramService } from '../../shared/telegram.service';
import { ChinhanhModule } from '../../cauhinh/chinhanh/chinhanh.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([VttechdieutriEntity]),
    ChinhanhModule
  ],
  controllers: [VttechdieutriController],
  providers: [VttechdieutriService,SharedService,TelegramService],
  exports: [VttechdieutriService]
})
export class VttechdieutriModule {}



