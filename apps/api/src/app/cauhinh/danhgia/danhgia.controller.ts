import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {DanhgiaService } from './danhgia.service';
import { CreateDanhgiaDto } from './dto/create-danhgia.dto';
import { UpdateDanhgiaDto } from './dto/update-danhgia.dto';
@Controller('danhgia')
export class DanhgiaController {
  constructor(private readonly danhgiaService:DanhgiaService) {}

  @Post()
  create(@Body() createDanhgiaDto: CreateDanhgiaDto) {
    return this.danhgiaService.create(createDanhgiaDto);
  }
  @Get()
  async findAll() {
    return await this.danhgiaService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.danhgiaService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.danhgiaService.findslug(slug);
  }
  @Get('findDM/:id')
  async findDM(@Param('id') id: string) {
    return await this.danhgiaService.findDM(id);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.danhgiaService.findPagination(page,perPage);
    }
  @Get('findquery')
    async findQuery(@Query('query') query: string){
      return await this.danhgiaService.findQuery(query);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDanhgiaDto: UpdateDanhgiaDto) {
    return this.danhgiaService.update(id, updateDanhgiaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.danhgiaService.remove(id);
  }
}