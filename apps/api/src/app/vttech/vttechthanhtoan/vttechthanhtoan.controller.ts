import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VttechthanhtoanService } from './vttechthanhtoan.service';
import { Interval } from '@nestjs/schedule';
import moment = require('moment');
@Controller('vttechthanhtoan')
export class VttechthanhtoanController {
  constructor(private readonly vttechthanhtoanService: VttechthanhtoanService) { }

  @Post()
  create(@Body() data: any) {
    return this.vttechthanhtoanService.create(data);
  }
  @Get()
  async findPagination(@Query('page') page: number, @Query('perpage') perPage: number) {
    const data = await this.vttechthanhtoanService.findPagination(page, perPage);
    data.data.forEach(async (v: any) => {
      v.CustCode = v.Dulieu.CustCode
      await this.vttechthanhtoanService.update(v.id, v)
      //v.CreatedDate = v.Dulieu.CreatedDate.split("T")[0]
     // await this.vttechthanhtoanService.update(v.id, v)
    });
    return data

  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.vttechthanhtoanService.findid(id);
  }
  @Get('findbycode/:code')
  async findbycode(@Param('code') CustCode: string) {
    return await this.vttechthanhtoanService.findbycode(CustCode);
  }
  @Get('findby/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.vttechthanhtoanService.findby(slug);
  }

  @Post('search')
  async findQuery(@Body() SearchParams: any) {
    return await this.vttechthanhtoanService.findQuery(SearchParams);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.vttechthanhtoanService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vttechthanhtoanService.remove(id);
  }
  // @Post('getthanhtoan')
  // async getThanhtoan(@Body() data: any) {
  //   const getData = await this.vttechthanhtoanService.getThanhtoan(data);
  //   return getData;
  // }
  @Interval(1200000)
  @Get('getauto')
  async getAuto() {
    const data:any= {
      "Name": "Taza",
      "Password": "1b9287d492b256x7taza",
      "Type": "web",
      "DateFrom": moment().subtract(1, 'day').format('YYYY-MM-DD'),
      "DateTo": moment().format('YYYY-MM-DD'),
      "BranchID": "0",
      "PagingNumber": "1"
    }
    const getData = await this.vttechthanhtoanService.getThanhtoan(data);
    return getData;
  }

  @Post('getthanhtoan')
  async getthanhtoan(@Body() data: any) {
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
     console.log(datamau);
    }
    const result = await this.vttechthanhtoanService.getThanhtoan(datamau);
    console.log(result);
    return result
  }
}
