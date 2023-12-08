import { Module } from '@nestjs/common';
import { NavigateService } from './navigate.service';
import { NavigateController } from './navigate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NavigateEntity } from './entities/navigate.entity';
@Module({
  imports: [TypeOrmModule.forFeature([NavigateEntity])],
  controllers: [NavigateController],
  providers: [NavigateService]
})
export class NavigateModule {}
