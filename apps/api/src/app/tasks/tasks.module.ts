import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { ZaloznsModule } from '../zalo/zalozns/zalozns.module';
import { TelegramService } from '../shared/telegram.service';

@Module({
  imports:[ZaloznsModule],
  controllers: [TasksController],
  providers: [TasksService,TelegramService],
  exports:[TasksService]
})
export class TasksModule {}
