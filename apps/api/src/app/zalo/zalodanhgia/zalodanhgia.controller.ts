import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {ZalodanhgiaService } from './zalodanhgia.service';
import { CreateZalodanhgiaDto } from './dto/create-zalodanhgia.dto';
import { UpdateZalodanhgiaDto } from './dto/update-zalodanhgia.dto';
@Controller('zalodanhgia')
export class ZalodanhgiaController {
  constructor(private readonly zalodanhgiaService:ZalodanhgiaService) {}
  @Post('getdanhgia')
  async getDanhgia(@Body() data: any) {
    const result = await this.zalodanhgiaService.getDanhgia(data);
    return result
  }
  @Post()
  create(@Body() createZalodanhgiaDto: CreateZalodanhgiaDto) {
    return this.zalodanhgiaService.create(createZalodanhgiaDto);
  }
  @Get()
  async findAll() {
    return await this.zalodanhgiaService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.zalodanhgiaService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.zalodanhgiaService.findslug(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.zalodanhgiaService.findPagination(page,perPage);
    }
  @Post('search')
    async findQuery(@Body() SearchParams: any){
      return await this.zalodanhgiaService.findQuery(SearchParams);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateZalodanhgiaDto: UpdateZalodanhgiaDto) {
    return this.zalodanhgiaService.update(id, updateZalodanhgiaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zalodanhgiaService.remove(id);
  }
}