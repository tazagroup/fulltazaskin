import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {ZaloznstrackingService } from './zaloznstracking.service';
import { CreateZaloznstrackingDto } from './dto/create-zaloznstracking.dto';
import { UpdateZaloznstrackingDto } from './dto/update-zaloznstracking.dto';
@Controller('zaloznstracking')
export class ZaloznstrackingController {
  constructor(private readonly zaloznstrackingService:ZaloznstrackingService) {}

  @Post()
  create(@Body() data: any) {
    return this.zaloznstrackingService.create(data);
  }
  @Get()
  async findAll() {
    return await this.zaloznstrackingService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.zaloznstrackingService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.zaloznstrackingService.findslug(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.zaloznstrackingService.findPagination(page,perPage);
    }
  @Post('search')
    async findQuery(@Body() SearchParams: any){
      return await this.zaloznstrackingService.findQuery(SearchParams);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateZaloznstrackingDto: UpdateZaloznstrackingDto) {
    return this.zaloznstrackingService.update(id, updateZaloznstrackingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zaloznstrackingService.remove(id);
  }
}