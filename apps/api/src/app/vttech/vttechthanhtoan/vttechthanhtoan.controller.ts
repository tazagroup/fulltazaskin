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
  async findAll() {
    return await this.vttechthanhtoanService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.vttechthanhtoanService.findid(id);
  }
  @Get('findby/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.vttechthanhtoanService.findby(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number, @Query('perPage') perPage: number) {
    return await this.vttechthanhtoanService.findPagination(page, perPage);
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
  @Post('getthanhtoan')
  async getThanhtoan(@Body() data: any) {
    const getData = await this.vttechthanhtoanService.getThanhtoan(data);
    return getData;
  }
  @Interval(1200000)
  @Get('getauto')
  async getAuto() {
    const data:any= {
      "Name": "Taza",
      "Password": "1b9287d492b256x7taza",
      "Type": "web",
      "DateFrom": moment().format('YYYY-MM-DD'),
      "DateTo": moment().format('YYYY-MM-DD'),
      "BranchID": "0",
      "PagingNumber": "1"
    }
    const getData = await this.vttechthanhtoanService.getThanhtoan(data);
    return getData;
  }
}
