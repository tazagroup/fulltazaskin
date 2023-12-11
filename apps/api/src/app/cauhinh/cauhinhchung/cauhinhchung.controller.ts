import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {CauhinhchungService } from './cauhinhchung.service';
import { CreateCauhinhchungDto } from './dto/create-cauhinhchung.dto';
import { UpdateCauhinhchungDto } from './dto/update-cauhinhchung.dto';
@Controller('cauhinhchung')
export class CauhinhchungController {
  constructor(private readonly cauhinhchungService:CauhinhchungService) {}

  @Post()
  create(@Body() createCauhinhchungDto: CreateCauhinhchungDto) {
    return this.cauhinhchungService.create(createCauhinhchungDto);
  }
  @Get()
  async findAll() {
    return await this.cauhinhchungService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.cauhinhchungService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.cauhinhchungService.findslug(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.cauhinhchungService.findPagination(page,perPage);
    }
  @Get('findquery')
    async findQuery(@Query('query') query: string){
      return await this.cauhinhchungService.findQuery(query);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCauhinhchungDto: UpdateCauhinhchungDto) {
    return this.cauhinhchungService.update(id, updateCauhinhchungDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cauhinhchungService.remove(id);
  }
}