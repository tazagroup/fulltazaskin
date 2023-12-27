import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {Vttech_khachhangService } from './vttech_khachhang.service';
@Controller('vttech_khachhang')
export class Vttech_khachhangController {
  constructor(private readonly vttech_khachhangService:Vttech_khachhangService) {}

  @Post()
  create(@Body() createVttech_khachhangDto: any) {
    return this.vttech_khachhangService.create(createVttech_khachhangDto);
  }
  @Get()
  async findAll() {
    return await this.vttech_khachhangService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.vttech_khachhangService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.vttech_khachhangService.findslug(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.vttech_khachhangService.findPagination(page,perPage);
    }
  @Post('search')
    async findQuery(@Body() SearchParams: any){
      return await this.vttech_khachhangService.findQuery(SearchParams);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVttech_khachhangDto: any) {
    return this.vttech_khachhangService.update(id, updateVttech_khachhangDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vttech_khachhangService.remove(id);
  }
}