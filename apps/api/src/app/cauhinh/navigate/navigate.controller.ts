import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {NavigateService } from './navigate.service';
import { CreateNavigateDto } from './dto/create-navigate.dto';
import { UpdateNavigateDto } from './dto/update-navigate.dto';
@Controller('navigate')
export class NavigateController {
  constructor(private readonly navigateService:NavigateService) {}

  @Post()
  create(@Body() createNavigateDto: CreateNavigateDto) {
    return this.navigateService.create(createNavigateDto);
  }
  @Get()
  async findAll() {
    return await this.navigateService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.navigateService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.navigateService.findslug(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.navigateService.findPagination(page,perPage);
    }
  @Get('findquery')
    async findQuery(@Query('query') query: string){
      return await this.navigateService.findQuery(query);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNavigateDto: UpdateNavigateDto) {
    return this.navigateService.update(id, updateNavigateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.navigateService.remove(id);
  }
}