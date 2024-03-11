import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {Vttech_dieutriService } from './vttech_dieutri.service';
import { LIST_CHI_NHANH } from '../../shared.utils';
import { Interval } from '@nestjs/schedule';
@Controller('vttech_dieutri')
export class Vttech_dieutriController {
  constructor(private readonly vttech_dieutriService:Vttech_dieutriService) {}
  @Interval(3600000)
  @Post("getvttech")
  GetDieutriVttech(@Body() data: any) {
    LIST_CHI_NHANH.forEach(async (v)=>{
       return await this.vttech_dieutriService.GetDieutriVttech(v.idVttech,data);
    })
  }
  @Post("sendcamon")
  async SendCamon(@Body() data: any) {   
    return await this.vttech_dieutriService.SendCamon(data);
  }
 //@Interval(4000000)
  @Get("sendauto")
  SendZNSAuto() {      
      return this.vttech_dieutriService.SendZNSAuto();
  }
  @Post()
  create(@Body() createVttech_dieutriDto: any) {
    return this.vttech_dieutriService.create(createVttech_dieutriDto);
  }
  @Get()
  async findAll() {
    return await this.vttech_dieutriService.findAll();
  }

  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.vttech_dieutriService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.vttech_dieutriService.findslug(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.vttech_dieutriService.findPagination(page,perPage);
    }
  @Post('search')
    async findQuery(@Body() SearchParams: any){
      return await this.vttech_dieutriService.findQuery(SearchParams);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVttech_dieutriDto: any) {
    return this.vttech_dieutriService.update(id, updateVttech_dieutriDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vttech_dieutriService.remove(id);
  }
}