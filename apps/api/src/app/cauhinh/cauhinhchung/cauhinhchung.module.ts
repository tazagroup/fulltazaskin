import { Module } from '@nestjs/common';
import { CauhinhchungService } from './cauhinhchung.service';
import { CauhinhchungController } from './cauhinhchung.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CauhinhchungEntity } from './entities/cauhinhchung.entity';
@Module({
  imports: [TypeOrmModule.forFeature([CauhinhchungEntity])],
  controllers: [CauhinhchungController],
  providers: [CauhinhchungService],
  exports :[CauhinhchungService]
})
export class CauhinhchungModule {}
