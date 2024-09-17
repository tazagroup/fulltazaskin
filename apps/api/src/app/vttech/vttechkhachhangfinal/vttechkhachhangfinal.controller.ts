import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VttechkhachhangfinalService } from './vttechkhachhangfinal.service';
import { Interval } from '@nestjs/schedule';
import moment = require('moment');
@Controller('vttechkhachhangfinal')
export class VttechkhachhangfinalController {
  constructor(private readonly vttechkhachhangfinalService: VttechkhachhangfinalService) { }

  @Post()
  create(@Body() data: any) {
    return this.vttechkhachhangfinalService.create(data);
  }
  @Get()
  async findPagination(@Query('page') page: number, @Query('perpage') perPage: number) {
    const data = await this.vttechkhachhangfinalService.findPagination(page, perPage);
    data.data.forEach(async (v: any) => {
      v.CustCode = v.Dulieu.Code
      await this.vttechkhachhangfinalService.update(v.id, v)
      //v.CreatedDate = v.Dulieu.CreatedDate.split("T")[0]
     // await this.vttechthanhtoanService.update(v.id, v)
    });
    return data
  }
  @Get('findbycode/:code')
  async findbycode(@Param('code') CustCode: string) {
    return await this.vttechkhachhangfinalService.findbycode(CustCode);
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.vttechkhachhangfinalService.findid(id);
  }
  @Get('findby/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.vttechkhachhangfinalService.findby(slug);
  }
  @Post('search')
  async findQuery(@Body() SearchParams: any) {
    return await this.vttechkhachhangfinalService.findQuery(SearchParams);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.vttechkhachhangfinalService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vttechkhachhangfinalService.remove(id);
  }
  @Post('getdieutri')
  async getdieutri(@Body() data: any) {
    const getData = await this.vttechkhachhangfinalService.getdieutri(data);
    return getData;
  }
  // @Interval(8000)
  @Interval(35*60*1000)
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
    const getData = await this.vttechkhachhangfinalService.getdieutri(data);
    return getData;
  }
}
