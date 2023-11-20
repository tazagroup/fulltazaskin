import { Module } from '@nestjs/common';
import { HangthanhvienService } from './hangthanhvien.service';
import { HangthanhvienController } from './hangthanhvien.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HangthanhvienEntity } from './entities/hangthanhvien.entity';
@Module({
  imports: [TypeOrmModule.forFeature([HangthanhvienEntity])],
  controllers: [HangthanhvienController],
  providers: [HangthanhvienService]
})
export class HangthanhvienModule {}
