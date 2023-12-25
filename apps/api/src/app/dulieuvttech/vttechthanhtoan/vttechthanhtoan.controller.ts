import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {VttechthanhtoanService } from './vttechthanhtoan.service';
import { CreateVttechthanhtoanDto } from './dto/create-vttechthanhtoan.dto';
import { UpdateVttechthanhtoanDto } from './dto/update-vttechthanhtoan.dto';
import { Interval, Timeout } from '@nestjs/schedule';
@Controller('vttechthanhtoan')
export class VttechthanhtoanController {
  constructor(private readonly vttechthanhtoanService:VttechthanhtoanService) {}
  @Interval(1800000)
  @Get('getapi')
  async getApiRealtime() {      
    return this.vttechthanhtoanService.getApiRealtime();
  }
  @Get('checkthanhtoan')
  async CheckThanhtoan() {      
    return this.vttechthanhtoanService.Checkthanhtoan();
  }
  @Post()
  create(@Body() createVttechthanhtoanDto: CreateVttechthanhtoanDto) {
    return this.vttechthanhtoanService.create(createVttechthanhtoanDto);
  }
  @Get()
  async findAll() {
    return await this.vttechthanhtoanService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.vttechthanhtoanService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.vttechthanhtoanService.findslug(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){    
       return await this.vttechthanhtoanService.findPagination(page,perPage);
    }
  @Get('findquery')
    async findQuery(@Query('query') query: string){
      return await this.vttechthanhtoanService.findQuery(query);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVttechthanhtoanDto: UpdateVttechthanhtoanDto) {
    return this.vttechthanhtoanService.update(id, updateVttechthanhtoanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vttechthanhtoanService.remove(id);
  }
}