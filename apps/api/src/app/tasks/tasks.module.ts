import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { ZaloznsModule } from '../zalo/zalozns/zalozns.module';
import { TelegramService } from '../shared/telegram.service';
import { VttechthanhtoanService } from '../dulieuvttech/vttechthanhtoan/vttechthanhtoan.service';
import { VttechthanhtoanModule } from '../dulieuvttech/vttechthanhtoan/vttechthanhtoan.module';

@Module({
  imports:[ZaloznsModule,VttechthanhtoanModule],
  controllers: [TasksController],
  providers: [TasksService,TelegramService],
  exports:[TasksService]
})
export class TasksModule {}
