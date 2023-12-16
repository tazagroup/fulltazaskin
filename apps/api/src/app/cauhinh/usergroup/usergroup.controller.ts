import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {UsergroupService } from './usergroup.service';
import { CreateUsergroupDto } from './dto/create-usergroup.dto';
import { UpdateUsergroupDto } from './dto/update-usergroup.dto';
@Controller('usergroup')
export class UsergroupController {
  constructor(private readonly usergroupService:UsergroupService) {}

  @Post()
  create(@Body() createUsergroupDto: CreateUsergroupDto) {
    return this.usergroupService.create(createUsergroupDto);
  }
  @Get()
  async findAll() {
    return await this.usergroupService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.usergroupService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.usergroupService.findslug(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.usergroupService.findPagination(page,perPage);
    }
  @Get('findquery')
    async findQuery(@Query('query') query: string){
      return await this.usergroupService.findQuery(query);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsergroupDto: UpdateUsergroupDto) {
    return this.usergroupService.update(id, updateUsergroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usergroupService.remove(id);
  }
}