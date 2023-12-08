import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {KhuyenmaiService } from './khuyenmai.service';
import { CreateKhuyenmaiDto } from './dto/create-khuyenmai.dto';
import { UpdateKhuyenmaiDto } from './dto/update-khuyenmai.dto';
@Controller('khuyenmai')
export class KhuyenmaiController {
  constructor(private readonly khuyenmaiService:KhuyenmaiService) {}

  @Post()
  create(@Body() createKhuyenmaiDto: CreateKhuyenmaiDto) {
    return this.khuyenmaiService.create(createKhuyenmaiDto);
  }
  @Get()
  async findAll() {
    return await this.khuyenmaiService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.khuyenmaiService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.khuyenmaiService.findslug(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.khuyenmaiService.findPagination(page,perPage);
    }
  @Get('findquery')
    async findQuery(@Query('query') query: string){
      return await this.khuyenmaiService.findQuery(query);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKhuyenmaiDto: UpdateKhuyenmaiDto) {
    return this.khuyenmaiService.update(id, updateKhuyenmaiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.khuyenmaiService.remove(id);
  }
}