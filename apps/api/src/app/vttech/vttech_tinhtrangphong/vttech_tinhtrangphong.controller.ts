import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {Vttech_tinhtrangphongService } from './vttech_tinhtrangphong.service';
@Controller('vttech_tinhtrangphong')
export class Vttech_tinhtrangphongController {
  constructor(private readonly vttech_tinhtrangphongService:Vttech_tinhtrangphongService) {}

  @Post()
  create(@Body() createVttech_tinhtrangphongDto: any) {
    return this.vttech_tinhtrangphongService.create(createVttech_tinhtrangphongDto);
  }
  @Get()
  async findAll() {
    return await this.vttech_tinhtrangphongService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.vttech_tinhtrangphongService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.vttech_tinhtrangphongService.findslug(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.vttech_tinhtrangphongService.findPagination(page,perPage);
    }
  @Post('search')
    async findQuery(@Body() SearchParams: any){
      return await this.vttech_tinhtrangphongService.findQuery(SearchParams);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVttech_tinhtrangphongDto: any) {
    return this.vttech_tinhtrangphongService.update(id, updateVttech_tinhtrangphongDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vttech_tinhtrangphongService.remove(id);
  }
}