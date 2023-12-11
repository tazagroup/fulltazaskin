import { Controller, Get, Post,Request, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private usersService: UsersService
    ) {}
  @Post('login')
  async login(@Body() user: any) {
    return await this.authService.login(user);
  }
  @Post('changepass')
  async changepass(@Body() dulieu: any) {
    return await this.authService.changepass(dulieu);
  }
  @Post('randompass')
  async randompass(@Body() dulieu: any) {
    return await this.authService.randompass(dulieu);
  }
  @Get('profile')
  @UseGuards(AuthGuard('tazaskin'))
  async getProfile(@Request() req) {
    const user = await this.usersService.findbySDT(req.user);    
    if(user)
    {     
      delete user.password;
      return user;
    }
    else return false;
  }
}
