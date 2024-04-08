import { Module } from '@nestjs/common';
import { VttechthanhtoanService } from './vttechthanhtoan.service';
import { VttechthanhtoanController } from './vttechthanhtoan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VttechthanhtoanEntity } from './entities/vttechthanhtoan.entity';
@Module({
  imports: [TypeOrmModule.forFeature([VttechthanhtoanEntity])],
  controllers: [VttechthanhtoanController],
  providers: [VttechthanhtoanService]
})
export class VttechthanhtoanModule {}
