import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {ChinhanhService } from './chinhanh.service';
import { CreateChinhanhDto } from './dto/create-chinhanh.dto';
import { UpdateChinhanhDto } from './dto/update-chinhanh.dto';
@Controller('chinhanh')
export class ChinhanhController {
  constructor(private readonly chinhanhService:ChinhanhService) {}

  @Post()
  create(@Body() createChinhanhDto: CreateChinhanhDto) {
    return this.chinhanhService.create(createChinhanhDto);
  }
  @Get()
  async findAll() {
    return await this.chinhanhService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.chinhanhService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.chinhanhService.findslug(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.chinhanhService.findPagination(page,perPage);
    }
  @Get('findquery')
    async findQuery(@Query('query') query: string){
      return await this.chinhanhService.findQuery(query);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChinhanhDto: UpdateChinhanhDto) {
    return this.chinhanhService.update(id, updateChinhanhDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chinhanhService.remove(id);
  }
}