import { Module } from '@nestjs/common';
import { VttechthanhtoanService } from './vttechthanhtoan.service';
import { VttechthanhtoanController } from './vttechthanhtoan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VttechthanhtoanEntity } from './entities/vttechthanhtoan.entity';
import { CauhinhchungModule } from '../../cauhinh/cauhinhchung/cauhinhchung.module';
import { TasksModule } from '../../tasks/tasks.module';
import { TelegramService } from '../../shared/telegram.service';
@Module({
  imports: [TypeOrmModule.forFeature([VttechthanhtoanEntity]),
  CauhinhchungModule,
  TasksModule
],
  controllers: [VttechthanhtoanController],
  providers: [VttechthanhtoanService,TelegramService]
})
export class VttechthanhtoanModule {}
