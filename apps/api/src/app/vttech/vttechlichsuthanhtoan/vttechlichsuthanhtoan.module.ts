import { Module } from '@nestjs/common';
import { VttechlichsuthanhtoanService } from './vttechlichsuthanhtoan.service';
import { VttechlichsuthanhtoanController } from './vttechlichsuthanhtoan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VttechlichsuthanhtoanEntity } from './entities/vttechlichsuthanhtoan.entity';
import { TelegramService } from '../../shared/telegram.service';
import { SharedService } from '../../shared/shared.service';
@Module({
  imports: [TypeOrmModule.forFeature([VttechlichsuthanhtoanEntity])],
  controllers: [VttechlichsuthanhtoanController],
  providers: [VttechlichsuthanhtoanService,SharedService,TelegramService]
})
export class VttechlichsuthanhtoanModule {}
