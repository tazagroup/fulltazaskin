import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsergroupService } from '../cauhinh/usergroup/usergroup.service';
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private _UsergroupService: UsergroupService,
    ) {}
  @Post("dangky")
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);
    if(newUser[0])
    {
      //this._emailService.sendEmail(newUser[1])
      return [true, 'Đăng Ký Thành Công']; 
    }
    else {
      return newUser
    }

  }
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.read(id);
  }
  @Get('findid/:id')
  async findid(@Param('id') id: string) {
    const user = await this.usersService.findid(id);
    const Groups = await this._UsergroupService.findAll()
    user['Groups'] = Groups.find((v)=>v.id==user.idGroup)?.ListMenu
    return user
  }
  @Get('SDT/:sdt')
  async findSDT(@Param('sdt') sdt: string) {
    const user = await this.usersService.findSDT(sdt);
    const Groups = await this._UsergroupService.findAll()
    user['Groups'] = Groups.find((v)=>v.id==user.idGroup)
    return user
  }
  @Get('/get/admin')
  @UseGuards(AuthGuard('tazaskin'))
  findAdmin() {
    return this.usersService.findAdmin();
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  @Post('changepass')
  changepass(@Body() data: any)
  {
    return this.usersService.changepass(data);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
