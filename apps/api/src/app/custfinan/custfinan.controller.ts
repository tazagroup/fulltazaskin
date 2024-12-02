import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {CustfinanService } from './custfinan.service';
import { CreateCustfinanDto } from './dto/create-custfinan.dto';
import { UpdateCustfinanDto } from './dto/update-custfinan.dto';
@Controller('custfinan')
export class CustfinanController {
  constructor(private readonly custfinanService:CustfinanService) {}

  @Post()
  create(@Body() createCustfinanDto: CreateCustfinanDto) {
    return this.custfinanService.create(createCustfinanDto);
  }
  @Get()
  async findAll() {
    return await this.custfinanService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.custfinanService.findid(id);
  }
  @Get('findSDT/:SDT')
  async findSDT(@Param('SDT') SDT: string) {
    return await this.custfinanService.findSDT(SDT);
  }
  @Get('findidKH/:idKH')
  async findidKH(@Param('idKH') idKH: string) {
    return await this.custfinanService.findidKH(idKH);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.custfinanService.findslug(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.custfinanService.findPagination(page,perPage);
    }
  @Get('findquery')
    async findQuery(@Query('query') query: string){
      return await this.custfinanService.findQuery(query);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustfinanDto: UpdateCustfinanDto) {
    return this.custfinanService.update(id, updateCustfinanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.custfinanService.remove(id);
  }
}