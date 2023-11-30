import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadEntity } from './entities/upload.entity';
import { UpserveService } from './upserve.service';
@Module({
  imports: [
  TypeOrmModule.forFeature([UploadEntity])
  ],
  controllers: [UploadController],
  providers: [UploadService,UpserveService]
})
export class UploadModule {}
