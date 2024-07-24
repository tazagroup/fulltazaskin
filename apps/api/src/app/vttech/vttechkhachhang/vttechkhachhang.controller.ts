import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VttechkhachhangService } from './vttechkhachhang.service';
import { Interval } from '@nestjs/schedule';
import moment = require('moment');
@Controller('vttechkhachhang')
export class VttechkhachhangController {
  constructor(private readonly vttechkhachhangService: VttechkhachhangService) { }

  @Post()
  create(@Body() data: any) {
    return this.vttechkhachhangService.create(data);
  }
  @Get()
  async findAll(@Query() params: any) {
    console.log(params);
    const data = await this.vttechkhachhangService.findPagination(params.page, params.perpage);
    data.data.forEach(async (v: any) => {
      v.CreatedDate = v.Dulieu.CreatedDate.split("T")[0]
      await this.vttechkhachhangService.update(v.id, v)
    });
    return data
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.vttechkhachhangService.findid(id);
  }
  @Get('findsdt/:sdt')
  async findsdt(@Param('sdt') sdt: string) {
    const result = await this.vttechkhachhangService.findsdt(sdt);
    if (result) {
      return result;
    } else {
      throw new Error(`Không tìm thấy khách hàng với sđt ${sdt}`);
    }

  }
  @Get('pagination')
  async findPagination(@Query('page') page: number, @Query('perPage') perPage: number) {
    return await this.vttechkhachhangService.findPagination(page, perPage);
  }
  @Post('search')
  async findQuery(@Body() SearchParams: any) {
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
    let datamau = data;
    if (!data) {
      datamau = {
        "Name": "Taza",
        "Password": "1b9287d492b256x7taza",
        "Type": "web",
        "BranchID": "0",
        "PagingNumber": "1",
        "DateFrom": moment().format('YYYY-MM-DD'),
        "DateTo": moment().format('YYYY-MM-DD'),
      }
      console.log(datamau);
    }
    return await this.vttechkhachhangService.getKhachhang(data);
  }
}
