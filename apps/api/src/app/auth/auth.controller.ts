import { Controller, Get, Post,Request, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UsergroupService } from '../cauhinh/usergroup/usergroup.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private usersService: UsersService,
    private _UsergroupService: UsergroupService,
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
    const userPromise = this.usersService.findbySDT(req.user);
    const groupsPromise = this._UsergroupService.findAll();
    const [user, Groups] = await Promise.all([userPromise, groupsPromise]); 
    //console.log(user,Groups);
    if (user) {
      delete user.password;
      user['Groups'] = Groups.find((v) => v.id === user.idGroup)?.ListMenu;
      user['Groups'] = user['Groups'].filter((v:any) => v.Checked === true);
      return user;
    } else {
      return false;
    }
    
  }
}
