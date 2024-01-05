import { Module } from '@nestjs/common';
import { VttechthanhtoanService } from './vttechthanhtoan.service';
import { VttechthanhtoanController } from './vttechthanhtoan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VttechthanhtoanEntity } from './entities/vttechthanhtoan.entity';
import { CauhinhchungModule } from '../../cauhinh/cauhinhchung/cauhinhchung.module';
//import { TasksModule } from '../../tasks/tasks.module';
import { TelegramService } from '../../shared/telegram.service';
import { ZaloznsService } from '../../zalo/zalozns/zalozns.service';
import { ZaloznsModule } from '../../zalo/zalozns/zalozns.module';
import { VttechthanhtoanZNSEntity } from './entities/vttechthanhtoan-zns.entity';
@Module({
  imports: [TypeOrmModule.forFeature([VttechthanhtoanEntity,VttechthanhtoanZNSEntity]),
  CauhinhchungModule,
  ZaloznsModule
 // TasksModule
],
  controllers: [VttechthanhtoanController],
  providers: [VttechthanhtoanService,TelegramService],
  exports:[VttechthanhtoanService]
})
export class VttechthanhtoanModule {}
