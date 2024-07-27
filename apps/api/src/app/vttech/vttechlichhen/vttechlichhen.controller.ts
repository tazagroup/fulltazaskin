import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {VttechlichhenService } from './vttechlichhen.service';
import { Interval } from '@nestjs/schedule';
import moment = require('moment');
@Controller('vttechlichhen')
export class VttechlichhenController {
  constructor(private readonly vttechlichhenService:VttechlichhenService) {}

  @Post()
  create(@Body() data: any) {
    return this.vttechlichhenService.create(data);
  }
  @Get('findbycode/:code')
  async findbycode(@Param('code') CustCode: string) {
    return await this.vttechlichhenService.findbycode(CustCode);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.vttechlichhenService.findslug(slug);
  }
  @Get()
  async findPagination(@Query('page') page: number,@Query('limit') perPage: number){
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
  @Interval(14400000)
  @Post('getlichhen')
  async getLichhen(@Body() data: any) {
    let datamau = data;
    if(!data)
    {
      datamau = {
        "Name": "Taza",
        "Password": "1b9287d492b256x7taza",
        "Type": "web",
        "DateFrom": moment().format('YYYY-MM-DD'),
        "DateTo": moment().format('YYYY-MM-DD'),
        "BranchID": "0",
        "PagingNumber": "1"
     }
    }
    const result = await this.vttechlichhenService.getLichhen(datamau);
    console.error('getlichhen',moment().format('YYYY-MM-DD'));
    return result
  }
}
