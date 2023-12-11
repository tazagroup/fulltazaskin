import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersEntity } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './entities/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { LocalStrategy } from './entities/local.strategy';
@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),UsersModule,PassportModule,
    JwtModule.register({
      secret: 'tazaskin',
      signOptions: { expiresIn: '30days' },
    }),
    ],
    providers: [AuthService,UsersService,JwtStrategy,LocalStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
