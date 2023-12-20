import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { ZaloznsModule } from '../zalo/zalozns/zalozns.module';

@Module({
  imports:[ZaloznsModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports:[TasksService]
})
export class TasksModule {}
