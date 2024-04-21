import { Module } from '@nestjs/common';
import { VttechdieutriService } from './vttechdieutri.service';
import { VttechdieutriController } from './vttechdieutri.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VttechdieutriEntity } from './entities/vttechdieutri.entity';
import { SharedService } from '../../shared/shared.service';
import { TelegramService } from '../../shared/telegram.service';
@Module({
  imports: [TypeOrmModule.forFeature([VttechdieutriEntity])],
  controllers: [VttechdieutriController],
  providers: [VttechdieutriService,SharedService,TelegramService],
  exports: [VttechdieutriService]
})
export class VttechdieutriModule {}



