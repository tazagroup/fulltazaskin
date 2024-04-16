import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {VttechlichsuthanhtoanService } from './vttechlichsuthanhtoan.service';
@Controller('vttechlichsuthanhtoan')
export class VttechlichsuthanhtoanController {
  constructor(private readonly vttechlichsuthanhtoanService:VttechlichsuthanhtoanService) {}
  // @Interval(1800000)
  @Post('getapi')
  async getThanhtoan(@Body() data: any) {    
    const getData = await this.vttechlichsuthanhtoanService.getAPI(data);
    return getData;
}
  @Post()
  create(@Body() data: any) {
    return this.vttechlichsuthanhtoanService.create(data);
  }
  @Get()
  async findAll() {
    return await this.vttechlichsuthanhtoanService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.vttechlichsuthanhtoanService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.vttechlichsuthanhtoanService.findslug(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.vttechlichsuthanhtoanService.findPagination(page,perPage);
    }
  @Post('search')
    async findQuery(@Body() SearchParams: any){
      return await this.vttechlichsuthanhtoanService.findQuery(SearchParams);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.vttechlichsuthanhtoanService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vttechlichsuthanhtoanService.remove(id);
  }
}