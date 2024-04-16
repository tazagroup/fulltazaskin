import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {VttechdieutriService } from './vttechdieutri.service';
@Controller('vttechdieutri')
export class VttechdieutriController {
  constructor(private readonly vttechdieutriService:VttechdieutriService) {}
  @Post('getdieutri')
  async getThanhtoan(@Body() data: any) {    
    const getData = await this.vttechdieutriService.getAPI(data);
    return getData;
  }
  @Post()
  create(@Body() data: any) {
    return this.vttechdieutriService.create(data);
  }
  @Get()
  async findAll() {
    return await this.vttechdieutriService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.vttechdieutriService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.vttechdieutriService.findslug(slug);
  }
  @Post('search')
    async findQuery(@Body() SearchParams: any){
      return await this.vttechdieutriService.findQuery(SearchParams);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.vttechdieutriService.update(id, data);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vttechdieutriService.remove(id);
  }
}