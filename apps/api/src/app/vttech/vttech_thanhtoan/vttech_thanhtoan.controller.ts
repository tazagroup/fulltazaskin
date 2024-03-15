import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {Vttech_thanhtoanService } from './vttech_thanhtoan.service';
import { CreateVttech_thanhtoanDto } from './dto/create-vttech_thanhtoan.dto';
import { UpdateVttech_thanhtoanDto } from './dto/update-vttech_thanhtoan.dto';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { LIST_CHI_NHANH } from '../../shared.utils';
@Controller('vttech_thanhtoan')
export class Vttech_thanhtoanController {
  constructor(private readonly vttech_thanhtoanService:Vttech_thanhtoanService) {}
 @Interval(1800000)
  @Post('getapi')
  async getApiRealtime(@Body() data: any) {    
    console.log(data);
    LIST_CHI_NHANH.forEach((v)=>{
      return this.vttech_thanhtoanService.getApiRealtime(v.idVttech,data);
    })
  }
//  @Interval(1900000)
//   @Get('sendauto')
//   async SendXNTTauto() {      
//     return this.vttech_thanhtoanService.SendXNTTauto();
//   }
//   @Post('sendzns')
//   async Send1zns(@Body() data:any) {   
//     console.log(data);
       
//     return this.vttech_thanhtoanService.sendZNSThanhtoan(data);
//   }
  @Post()
  create(@Body() data: any) {
    return this.vttech_thanhtoanService.create(data);
  }
  @Get()
  async findAll() {
    return await this.vttech_thanhtoanService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.vttech_thanhtoanService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.vttech_thanhtoanService.findslug(slug);
  }
  @Post('search')
    async findQuery(@Body() SearchParams: any){
      return await this.vttech_thanhtoanService.findQuery(SearchParams);
  }
  // @Post('search')
  //   async findQuery(@Body() SearchParams: any){
  //     return await this.vttech_thanhtoanService.findQuery(SearchParams);
  // }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVttech_thanhtoanDto: UpdateVttech_thanhtoanDto) {
    return this.vttech_thanhtoanService.update(id, updateVttech_thanhtoanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vttech_thanhtoanService.remove(id);
  }
}