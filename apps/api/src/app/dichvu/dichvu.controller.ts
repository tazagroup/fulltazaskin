import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {DichvuService } from './dichvu.service';
import { CreateDichvuDto } from './dto/create-dichvu.dto';
import { UpdateDichvuDto } from './dto/update-dichvu.dto';
@Controller('dichvu')
export class DichvuController {
  constructor(private readonly dichvuService:DichvuService) {}

  @Post()
  create(@Body() createDichvuDto: CreateDichvuDto) {
    return this.dichvuService.create(createDichvuDto);
  }
  @Get()
  async findAll() {
    return await this.dichvuService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.dichvuService.findid(id);
  }
  @Get('findbyDM/:id')
  findbyDM(@Param('id') id: string) {
    return this.dichvuService.findbyDM(id);
  }
  @Get('findNoibat')
  async findNoibat() {
    return await this.dichvuService.findNoibat();
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.dichvuService.findslug(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.dichvuService.findPagination(page,perPage);
    }
  @Get('findquery')
    async findQuery(@Query('query') query: string){
      return await this.dichvuService.findQuery(query);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDichvuDto: UpdateDichvuDto) {
    return this.dichvuService.update(id, updateDichvuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dichvuService.remove(id);
  }
}

