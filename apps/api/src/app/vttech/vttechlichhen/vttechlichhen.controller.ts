import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {VttechlichhenService } from './vttechlichhen.service';
@Controller('vttechlichhen')
export class VttechlichhenController {
  constructor(private readonly vttechlichhenService:VttechlichhenService) {}

  @Post()
  create(@Body() data: any) {
    return this.vttechlichhenService.create(data);
  }
  @Get()
  async findAll() {
    return this.vttechlichhenService.findAll();
  }
  @Get('findbycode/:code')
  async findbycode(@Param('code') CustCode: string) {
    return await this.vttechlichhenService.findbycode(CustCode);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.vttechlichhenService.findslug(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.vttechlichhenService.findPagination(page,perPage);
    }
  @Post('search')
    async findQuery(@Body() SearchParams: any){
      return await this.vttechlichhenService.findQuery(SearchParams);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.vttechlichhenService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vttechlichhenService.remove(id);
  }
  @Post('getlichhen')
  async getLichhen(@Body() data: any) {
  //   const datamau = {
  //     "DateFrom": "2019-02-01",
  //     "DateTo": "2019-02-28",
  //     "BranchID": "0",
  //     "DataType": "new",
  //     "PagingNumber": "1"
  // }
    return await this.vttechlichhenService.getLichhen(data);
  }
}
