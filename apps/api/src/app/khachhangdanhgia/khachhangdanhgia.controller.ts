import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {KhachhangdanhgiaService } from './khachhangdanhgia.service';
import { CreateKhachhangdanhgiaDto } from './dto/create-khachhangdanhgia.dto';
import { UpdateKhachhangdanhgiaDto } from './dto/update-khachhangdanhgia.dto';
@Controller('khachhangdanhgia')
export class KhachhangdanhgiaController {
  constructor(private readonly khachhangdanhgiaService:KhachhangdanhgiaService) {}

  @Post()
  create(@Body() createKhachhangdanhgiaDto: CreateKhachhangdanhgiaDto) {
    return this.khachhangdanhgiaService.create(createKhachhangdanhgiaDto);
  }
  @Get()
  async findAll() {
    return await this.khachhangdanhgiaService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.khachhangdanhgiaService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.khachhangdanhgiaService.findslug(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.khachhangdanhgiaService.findPagination(page,perPage);
    }
  @Get('findquery')
    async findQuery(@Query('query') query: string){
      return await this.khachhangdanhgiaService.findQuery(query);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKhachhangdanhgiaDto: UpdateKhachhangdanhgiaDto) {
    return this.khachhangdanhgiaService.update(id, updateKhachhangdanhgiaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.khachhangdanhgiaService.remove(id);
  }
}