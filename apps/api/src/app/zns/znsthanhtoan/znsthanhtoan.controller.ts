import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {ZnsthanhtoanService } from './znsthanhtoan.service';
import { Interval } from '@nestjs/schedule';
import moment = require('moment');
import { TelegramService } from '../../shared/telegram.service';
@Controller('znsthanhtoan')
export class ZnsthanhtoanController {
  constructor(
    private readonly znsthanhtoanService:ZnsthanhtoanService,
    private readonly _TelegramService:TelegramService,
  ) {}
  @Interval(1500000)
  // @Interval(900)
  @Post('createzns')
  createzns(@Body() data: any={}) {
    data.pageSize =  9999;
    data.CreatedBegin?data.CreatedBegin = moment(data.CreatedBegin).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
    data.createdEnd?data.createdEnd = moment(data.createdEnd).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
    return this.znsthanhtoanService.createzns(data);
  }
  @Post('sendzns')
  sendzns(@Body() data: any) {
    return this.znsthanhtoanService.sendzns(data);
  }
 // @Interval(300000)
  @Post('sendznsauto')
  async sendznsauto(@Body() data: any={}) {
  //  this._TelegramService.SendMiniAppLogdev(`[ZNS_THANHTOAN] - Gửi ZNS Tự Động Thanh Toán - ${moment().format('HH:mm:ss DD/MM/YYYY')}`);
    data.CreatedBegin?data.CreatedBegin = moment(data.CreatedBegin).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
    data.createdEnd?data.createdEnd = moment(data.createdEnd).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
    data.Status = 0;
    data.pageSize =  9999;
    if(this.CheckTime() == true){
      const result = await this.findQuery(data)
    this._TelegramService.SendMiniAppLogdev(`[ZNS_THANHTOAN] - Step3 - Gửi ZNS Tự Động (${result.totalCount}) Thanh Toán - ${moment().format('HH:mm:ss DD/MM/YYYY')}`);
      if(result.items.length > 0){
        // await Promise.all(result.items.map(async (v,k) => {
        //   setTimeout(async () => {
        //     await this.sendzns(v); 
        //   }, k*2000);
        // }));
        result.items.forEach(async (v,k) => {
          setTimeout(async () => {
            await this.sendzns(v); 
          }, k*100);
          
        })
        return result;
      }
    }
    else  return "Không thể gửi tin nhắn vào thời gian này";
  }
  // sendznsauto(@Body() data: any) {
  //   return this.znsthanhtoanService.sendznsauto(data);
  // }
  @Post()
  create(@Body() data: any) {
    return this.znsthanhtoanService.create(data);
  }
  @Get()
  async findAll() {
    return await this.znsthanhtoanService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.znsthanhtoanService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.znsthanhtoanService.findslug(slug);
  }
  @Post('search')
    async findQuery(@Body() SearchParams: any){
      return await this.znsthanhtoanService.findQuery(SearchParams);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.znsthanhtoanService.update(id, data);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.znsthanhtoanService.remove(id);
  }
  CheckTime() {
    const now = moment();
    const checkTime = now.hour() >= 8 && now.hour() <= 21;
    return checkTime
  }
}