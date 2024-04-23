import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {VttechkhachhangService } from './vttechkhachhang.service';
import { Interval } from '@nestjs/schedule';
@Controller('vttechkhachhang')
export class VttechkhachhangController {
  constructor(private readonly vttechkhachhangService:VttechkhachhangService) {}

  @Post()
  create(@Body() data: any) {
    return this.vttechkhachhangService.create(data);
  }
  @Get()
  async findAll() {
    return await this.vttechkhachhangService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.vttechkhachhangService.findid(id);
  }
  @Get('findby/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.vttechkhachhangService.findby(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.vttechkhachhangService.findPagination(page,perPage);
    }
  @Post('search')
    async findQuery(@Body() SearchParams: any){
      return await this.vttechkhachhangService.findQuery(SearchParams);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.vttechkhachhangService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vttechkhachhangService.remove(id);
  }
  // @Interval(1800000)
  @Post('getkhachhang')
  async getKhachhang(@Body() data: any) { 
    return await this.vttechkhachhangService.getKhachhang(data);
    // const ListDate = await this.getListRangeDate();   
    // ListDate.forEach(async (v:any,k:any) => {
    //   data.DateFrom = v.startDate;
    //   data.DateTo = v.endDate;
    //   setTimeout(async () => {
    //     await this.vttechkhachhangService.getKhachhang(data);
    //   }, k*1000);
  
    // });
  }
async getListRangeDate() {
  let startDate = new Date(2019, 0, 1); // Start date: 01/01/2019
  let endDate = new Date(2024, 4, 1); // End date: 01/05/2024
  const result = [];
  while (startDate < endDate) {
    let lastDayOfMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    result.push({ startDate: startDate.toISOString().slice(0, 10), endDate: lastDayOfMonth.toISOString().slice(0, 10) });
    startDate.setMonth(startDate.getMonth() + 1);
  }
  return result;
}
}