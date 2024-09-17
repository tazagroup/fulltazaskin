import { Module } from '@nestjs/common';
import { VttechkhachhangfinalService } from './vttechkhachhangfinal.service';
import { VttechkhachhangfinalController } from './vttechkhachhangfinal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VttechkhachhangfinalEntity } from './entities/vttechkhachhangfinal.entity';
import { SharedService } from '../../shared/shared.service';
import { ChinhanhModule } from '../../cauhinh/chinhanh/chinhanh.module';
import { LoggerModule } from '../../logger/logger.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([VttechkhachhangfinalEntity]),
    ChinhanhModule,
    LoggerModule
  ],
  controllers: [VttechkhachhangfinalController],
  providers: [VttechkhachhangfinalService,SharedService],
  exports: [VttechkhachhangfinalService]
})
export class VttechkhachhangfinalModule {}



