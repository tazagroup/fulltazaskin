import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CauhinhModule } from './cauhinh/cauhinh.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZaloModule } from './zalo/zalo.module';
import { HttpModule} from '@nestjs/axios';
import { DanhmucModule } from './danhmuc/danhmuc.module';
import { DichvuModule } from './dichvu/dichvu.module';
import { UploadModule } from './upload/upload.module';
import { DanhgiaModule } from './cauhinh/danhgia/danhgia.module';
import { KhachhangdanhgiaModule } from './khachhangdanhgia/khachhangdanhgia.module';
import { LichhenModule } from './lichhen/lichhen.module';
import { ScheduleModule } from '@nestjs/schedule';
import { VttechthanhtoanModule } from './dulieuvttech/vttechthanhtoan/vttechthanhtoan.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { KhachhangsModule } from './khachhang/khachhang/khachhang.module';
import { ChitietModule } from './khachhang/chitiet/chitiet.module';
import { KhachhangdichvuModule } from './khachhang/khachhangdichvu/khachhangdichvu.module';
import { VttechModule } from './vttech/vttech.module';
import { TasksModule } from './tasks/tasks.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '103.221.222.71',
      port: 3306,
      username: 'tazaspac_chikiet',
      password: '@Hikiet88',
      database: 'tazaspac_zalotazaskin',
      autoLoadEntities: true,
      synchronize: true,
      charset: "utf8mb4",
    }),
    KhachhangsModule, 
    ChitietModule,
    CauhinhModule,
    ZaloModule,
    HttpModule,
    DanhmucModule,
    DichvuModule,
    UploadModule,
    DanhgiaModule,
    KhachhangdanhgiaModule,
    LichhenModule,
    VttechthanhtoanModule,
    AuthModule,
    UsersModule,
    KhachhangdichvuModule,
    VttechModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
