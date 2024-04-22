import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {ZnsdieutriService } from './znsdieutri.service';
import { Interval } from '@nestjs/schedule';
import moment = require('moment');
import { TelegramService } from '../../shared/telegram.service';
@Controller('znsdieutri')
export class ZnsdieutriController {
  constructor(
    private readonly znsdieutriService:ZnsdieutriService,
    private readonly _TelegramService:TelegramService,
  ) {}
  @Interval(2100000)
  @Post('createzns')
  createzns(@Body() data: any) {
    return this.znsdieutriService.createzns(data);
  }
  @Post('sendzns')
  sendzns(@Body() data: any) {    
    return this.znsdieutriService.sendzns(data);
  }
  @Interval(2400000)
  @Post('sendznsauto')
  async sendznsauto(@Body() data: any) {
    this._TelegramService.SendMiniAppLogdev(`[ZNS_DIEUTRI] - Gửi ZNS Tự Động Điều Trị - ${moment().format('HH:mm:ss DD/MM/YYYY')}`);
    data.CreatedBegin?data.CreatedBegin = moment(data.CreatedBegin).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
    data.createdEnd?data.createdEnd = moment(data.createdEnd).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
    data.Status = 0;
    if(this.CheckTime() == true){
      const result = await this.findQuery(data)
      if(result.items.length > 0){
        for (const item of result.items) {
          await this.sendzns(item)
        }
        return result
      }
    }
    else  
    {
      this._TelegramService.SendMiniAppLogdev(`[ZNS_DIEUTRI] - Không thể gửi tin nhắn vào thời gian này - ${moment().format('HH:mm:ss DD/MM/YYYY')}`);
    }

  }
  @Post()
  create(@Body() data: any) {
    return this.znsdieutriService.create(data);
  }
  @Get()
  async findAll() {
    return await this.znsdieutriService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.znsdieutriService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.znsdieutriService.findslug(slug);
  }
  @Post('search')
    async findQuery(@Body() SearchParams: any){
      return await this.znsdieutriService.findQuery(SearchParams);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.znsdieutriService.update(id, data);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.znsdieutriService.remove(id);
  }
  CheckTime() {
    const now = moment();
    const checkTime = now.hour() >= 8 && now.hour() <= 21;
    return checkTime
  }
}