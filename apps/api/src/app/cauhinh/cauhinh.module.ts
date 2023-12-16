import { Module } from '@nestjs/common';
import { CauhinhService } from './cauhinh.service';
import { CauhinhController } from './cauhinh.controller';
import { CauhinhEntity } from './entities/cauhinh.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HangthanhvienModule } from './hangthanhvien/hangthanhvien.module';
import { ChinhanhModule } from './chinhanh/chinhanh.module';
import { BannerModule } from './banner/banner.module';
import { NavigateModule } from './navigate/navigate.module';
import { KhuyenmaiModule } from './khuyenmai/khuyenmai.module';
import { CauhinhchungModule } from './cauhinhchung/cauhinhchung.module';
import { MenuModule } from './menu/menu.module';
import { UsergroupModule } from './usergroup/usergroup.module';
@Module({
  imports: [TypeOrmModule.forFeature([CauhinhEntity]), HangthanhvienModule, ChinhanhModule, BannerModule, NavigateModule, KhuyenmaiModule, CauhinhchungModule, MenuModule, UsergroupModule],
  controllers: [CauhinhController],
  providers: [CauhinhService],
  exports:[CauhinhService]
})
export class CauhinhModule {}
