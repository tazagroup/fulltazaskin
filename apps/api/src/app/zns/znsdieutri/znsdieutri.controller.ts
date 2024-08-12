import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {ZnsdieutriService } from './znsdieutri.service';
import { Interval } from '@nestjs/schedule';
import moment = require('moment');
import { LoggerService } from '../../logger/logger.service';
@Controller('znsdieutri')
export class ZnsdieutriController {
  constructor(
    private readonly znsdieutriService:ZnsdieutriService,
    private readonly _LoggerService:LoggerService,
  ) {}
  @Interval(660000)
  @Post('createzns')
  createzns(@Body() data: any={}) {
    data.pageSize =  9999;
    data.CreatedBegin?data.CreatedBegin = moment(data.CreatedBegin).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
    data.createdEnd?data.createdEnd = moment(data.createdEnd).add(1, 'day').format('YYYY-MM-DD'):moment().add(1, 'day').format('YYYY-MM-DD');
    return this.znsdieutriService.createzns(data);
  }
  @Post('sendzns')
  sendzns(@Body() data: any) {
    return this.znsdieutriService.sendzns(data);
  }
  //@Interval(10000)
 ///@Interval(720000)
  @Post('sendznsauto')
  async sendznsauto(@Body() data: any={}) {
    data.CreatedBegin?data.CreatedBegin = moment(data.CreatedBegin).subtract(1, 'day').format('YYYY-MM-DD'):moment().subtract(1, 'day').format('YYYY-MM-DD');
    data.createdEnd?data.createdEnd = moment(data.createdEnd).add(1, 'day').format('YYYY-MM-DD'):moment().add(1, 'day').format('YYYY-MM-DD');
    data.Status = 0;
    data.pageSize =  9999;
    if(this.CheckTime() == true){
      const result = await this.findQuery(data)
      const logger ={
        Title:'ZNS Điều Trị',
        Slug:'dieutri',
        Action:'send',
        Mota:`[ZNS_DIEUTRI] - Step3 - Gửi Tự Động (${result.totalCount}) Điều Trị - ${moment().format('HH:mm:ss DD/MM/YYYY')} ${JSON.stringify(data)}`}
      this._LoggerService.create(logger)
      if(result.totalCount > 0){
        result.items.forEach(async (v,k) => {
          setTimeout(async () => {
            await this.sendzns(v);
          }, k*100);
        })
        return result;
     }
    }
    else
    {
      const logger ={
        Title:'ZNS Điều Trị',
        Slug:'dieutri',
        Action:'send_error',
        Mota:`[ZNS_DIEUTRI] - Không thể gửi tin nhắn vào thời gian này - ${moment().format('HH:mm:ss DD/MM/YYYY')}`}
      this._LoggerService.create(logger)
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
    const checkTime = now.hour() >= 8 && now.hour() <= 22;
    return checkTime
  }
}
