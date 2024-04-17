import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {ZnsdieutriService } from './znsdieutri.service';
import { Interval } from '@nestjs/schedule';
import moment = require('moment');
@Controller('znsdieutri')
export class ZnsdieutriController {
  constructor(private readonly znsdieutriService:ZnsdieutriService) {}
  @Interval(1900000)
  @Post('createzns')
  createzns(@Body() data: any) {
    return this.znsdieutriService.createzns(data);
  }
  //@Interval(1900000)
  @Post('sendzns')
  sendzns(@Body() data: any) {
    return this.znsdieutriService.sendzns(data);
  }
  @Post('sendznsauto')
  sendznsauto(@Body() data: any) {
    return this.znsdieutriService.sendznsauto(data);
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