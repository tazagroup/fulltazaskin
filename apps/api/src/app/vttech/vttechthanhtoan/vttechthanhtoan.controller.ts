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
    // data.data.forEach(async (v: any, k: any) => {
    //   //  v.CustCode = v.Dulieu.CustCode
    //   console.log('K',k);
    //     setTimeout(() => {
    //       v.State = v?.Dulieu?.State
    //       this.vttechthanhtoanService.update(v.id, v)
    //       console.log(k);

    //     }, k * 10);
    //   //v.CreatedDate = v.Dulieu.CreatedDate.split("T")[0]
    //   // await this.vttechthanhtoanService.update(v.id, v)
    // });
    return data.totalItems

  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.vttechthanhtoanService.findid(id);
  }
  @Get('findbycode/:code')
  async findbycode(@Param('code') CustCode: string) {
    const result = await this.vttechthanhtoanService.findbycode(CustCode);
    console.log(result);
    // return result
    return result[0].map((v: any) => ({ ...v.Dulieu }))
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
  @Interval(22*60*1000)
  @Get('getauto')
  async getAuto() {
    console.error('Get Thanh Toán 1',moment().format('YYYY-MM-DD HH:mm:ss'));
    const data: any = {
      "Name": "Taza",
      "Password": "1b9287d492b256x7taza",
      "Type": "web",
      "DateFrom": moment().subtract(1, 'day').format('YYYY-MM-DD'),
      "DateTo": moment().add(1, 'days').format('YYYY-MM-DD'),
      "BranchID": "0",
      "PagingNumber": "1"
    }
    const getData = await this.vttechthanhtoanService.getThanhtoan(data);
    // console.error('GetThanhtoan DateFrom', moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'));
    // console.error('GetThanhtoan DateTo', moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'));
    return getData;
  }

  @Post('getthanhtoan')
  async getthanhtoan(@Body() data: any) {
    let datamau = data;
    if (!data) {
      datamau = {
        "Name": "Taza",
        "Password": "1b9287d492b256x7taza",
        "Type": "web",
        "DateFrom": moment().subtract(1, 'day').format('YYYY-MM-DD'),
        "DateTo": moment().add(1, 'days').format('YYYY-MM-DD'),
        "BranchID": "0",
        "PagingNumber": "1"
      }
    }
    const result = await this.vttechthanhtoanService.getThanhtoan(datamau);
    return result
  }
}
