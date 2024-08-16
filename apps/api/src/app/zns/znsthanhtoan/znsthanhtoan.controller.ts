import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {ZnsthanhtoanService } from './znsthanhtoan.service';
import { Cron, Interval } from '@nestjs/schedule';
import moment = require('moment');
import { LoggerService } from '../../logger/logger.service';
@Controller('znsthanhtoan')
export class ZnsthanhtoanController {
  constructor(
    private readonly znsthanhtoanService:ZnsthanhtoanService,
    private readonly _LoggerService:LoggerService,
  ) {}
  @Interval(1320000)
  @Post('createzns')
  createzns(@Body() data: any={}) {
    console.error('Tạo ZNS Thanh Toán 2',moment().format('YYYY-MM-DD HH:mm:ss'));
    data.pageSize =  9999;
    data.CreatedBegin?data.CreatedBegin = moment(data.CreatedBegin).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
    data.createdEnd?data.createdEnd = moment(data.createdEnd).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
    return this.znsthanhtoanService.createzns(data);
  }
  @Post('sendzns')
  sendzns(@Body() data: any) {
    return this.znsthanhtoanService.sendzns(data);
  }
  @Get('gettime')
  gettime() {
    console.log(moment().format('YYYY-MM-DD HH:mm:ss'));

  }
  @Interval(1440000)
  @Post('sendznsauto')
  async sendznsauto(@Body() data: any={}) {
    console.error('Gửi ZNS Thanh Toán Auto 3',moment().format('YYYY-MM-DD HH:mm:ss'));
    data.CreatedBegin = data.CreatedBegin ? moment(data.CreatedBegin).subtract(1, 'day').format('YYYY-MM-DD') : moment().subtract(1, 'day').format('YYYY-MM-DD');
    data.createdEnd = data.createdEnd ? moment(data.createdEnd).add(1, 'day').format('YYYY-MM-DD') : moment().add(1, 'day').format('YYYY-MM-DD');
    data.Status = 0;
    data.pageSize =  9999;
    if(this.CheckTime() == true){
      const result = await this.findQuery(data)
      const logger ={
        Title:'Vttech ZNS Thanh Toán',
        Slug:'vttechznsthanhtoan',
        Action:'send',
        Mota:`[ZNS_THANHTOAN] - Step3 - Gửi ZNS Tự Động (${result.totalCount}) Thanh Toán - ${moment().format('HH:mm:ss DD/MM/YYYY')}`}
     this._LoggerService.create(logger)

      if(result.items.length > 0){
        //console.log('sendznsauto running3');
        result.items.forEach(async (v,k) => {
          setTimeout(async () => {
           await this.sendzns(v);
          }, k*1000);

        })
        return result;
      }
    }
    else  return "Không thể gửi tin nhắn vào thời gian này";
  }
  @Cron('00 45 21 * * *')
  @Post('sendznsauto')
  async sendznsautoCron(@Body() data: any={}) {
    console.error('Gửi ZNS Thanh Toán Auto Cuối Ngày 4',moment().format('YYYY-MM-DD HH:mm:ss'));
    const logger ={
      Title:'Vttech ZNS Thanh Toán',
      Slug:'vttechznsthanhtoan',
      Action:'send',
      Mota:`[ZNS_THANHTOAN] - Lenh Cuoi Ngay - ${moment().format('HH:mm:ss DD/MM/YYYY')}`}
   this._LoggerService.create(logger)
    data.CreatedBegin = data.CreatedBegin ? moment(data.CreatedBegin).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
    data.createdEnd = data.createdEnd ? moment(data.createdEnd).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
    data.Status = 0;
    data.pageSize =  9999;
    if(this.CheckTime() == true){
      const result = await this.findQuery(data)
      const logger1 ={
        Title:'Vttech ZNS Thanh Toán',
        Slug:'vttechznsthanhtoan',
        Action:'send',
        Mota:`[ZNS_THANHTOAN] - Step3Auto - Gửi ZNS Tự Động (${result.totalCount}) Thanh Toán - ${moment().format('HH:mm:ss DD/MM/YYYY')}`}
     this._LoggerService.create(logger1)

      if(result.items.length > 0){
        result.items.forEach(async (v,k) => {
          setTimeout(async () => {
           await this.sendzns(v);
          }, k*1000);

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
    const checkTime = now.hour() >= 8 && now.hour() <= 22;
    return checkTime
  }
}
