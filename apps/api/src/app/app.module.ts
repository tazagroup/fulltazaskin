import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KhachhangModule } from './khachhang/khachhang.module';
import { CauhinhModule } from './cauhinh/cauhinh.module';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
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
    KhachhangModule, CauhinhModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
