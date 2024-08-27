import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VttechdieutriService } from './vttechdieutri.service';
import { Interval } from '@nestjs/schedule';
import moment = require('moment');
@Controller('vttechdieutri')
export class VttechdieutriController {
  constructor(private readonly vttechdieutriService: VttechdieutriService) { }

  @Post()
  create(@Body() data: any) {
    return this.vttechdieutriService.create(data);
  }
  @Get()
  async findPagination(@Query('page') page: number, @Query('perpage') perPage: number) {
    const data = await this.vttechdieutriService.findPagination(page, perPage);
    data.data.forEach(async (v: any) => {
      v.CustCode = v.Dulieu.Code
      await this.vttechdieutriService.update(v.id, v)
      //v.CreatedDate = v.Dulieu.CreatedDate.split("T")[0]
     // await this.vttechthanhtoanService.update(v.id, v)
    });
    return data
  }
  @Get('findbycode/:code')
  async findbycode(@Param('code') CustCode: string) {
    return await this.vttechdieutriService.findbycode(CustCode);
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.vttechdieutriService.findid(id);
  }
  @Get('findby/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.vttechdieutriService.findby(slug);
  }
  @Post('search')
  async findQuery(@Body() SearchParams: any) {
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
  @Post('getdieutri')
  async getdieutri(@Body() data: any) {
    const getData = await this.vttechdieutriService.getdieutri(data);
    return getData;
  }
  // @Interval(8000)
  @Interval(20*60*1000)
  @Get('getauto')
  async getAuto() {
    console.error('Get Diều Trị 1',moment().format('YYYY-MM-DD HH:mm:ss'));
    const data: any = {
      "Name": "Taza",
      "Password": "1b9287d492b256x7taza",
      "Type": "web",
      "DateFrom": moment().format('YYYY-MM-DD'),
      "DateTo": moment().format('YYYY-MM-DD'),
      "BranchID": "0",
      "PagingNumber": "1"
    }
    const getData = await this.vttechdieutriService.getdieutri(data);
    return getData;
  }
}
