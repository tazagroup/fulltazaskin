import { Module } from '@nestjs/common';
import { UsergroupService } from './usergroup.service';
import { UsergroupController } from './usergroup.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsergroupEntity } from './entities/usergroup.entity';
@Module({
  imports: [TypeOrmModule.forFeature([UsergroupEntity])],
  controllers: [UsergroupController],
  providers: [UsergroupService],
  exports:[UsergroupService]
})
export class UsergroupModule {}
