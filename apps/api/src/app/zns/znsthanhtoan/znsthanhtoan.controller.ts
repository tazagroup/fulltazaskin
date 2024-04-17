import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {ZnsthanhtoanService } from './znsthanhtoan.service';
import { Interval } from '@nestjs/schedule';
import moment = require('moment');
@Controller('znsthanhtoan')
export class ZnsthanhtoanController {
  constructor(private readonly znsthanhtoanService:ZnsthanhtoanService) {}
  @Interval(1900000)
  @Post('createzns')
  createzns(@Body() data: any) {
    return this.znsthanhtoanService.createzns(data);
  }
  //@Interval(1900000)
  @Post('sendzns')
  sendzns(@Body() data: any) {
    return this.znsthanhtoanService.sendzns(data);
  }
  @Post('sendznsauto')
  sendznsauto(@Body() data: any) {
    return this.znsthanhtoanService.sendznsauto(data);
  }
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