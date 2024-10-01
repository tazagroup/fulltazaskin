import { Module } from '@nestjs/common';
import { VttechkhachhangService } from './vttechkhachhang.service';
import { VttechkhachhangController } from './vttechkhachhang.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VttechkhachhangEntity } from './entities/vttechkhachhang.entity';
import { TelegramService } from '../../shared/telegram.service';
import { SharedService } from '../../shared/shared.service';
import { LoggerModule } from '../../logger/logger.module';
@Module({
  imports: [TypeOrmModule.forFeature([VttechkhachhangEntity]),
  LoggerModule
],
  controllers: [VttechkhachhangController],
  providers: [VttechkhachhangService,SharedService],
  exports:[VttechkhachhangService]
})
export class VttechkhachhangModule {}
