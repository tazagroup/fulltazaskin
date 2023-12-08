import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {LichhenService } from './lichhen.service';
import { CreateLichhenDto } from './dto/create-lichhen.dto';
import { UpdateLichhenDto } from './dto/update-lichhen.dto';
@Controller('lichhen')
export class LichhenController {
  constructor(private readonly lichhenService:LichhenService) {}

  @Post()
  create(@Body() createLichhenDto: CreateLichhenDto) {
    return this.lichhenService.create(createLichhenDto);
  }
  @Get()
  async findAll() {
    return await this.lichhenService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.lichhenService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.lichhenService.findslug(slug);
  }
  @Get('findmadh/:madh')
  async findmadh(@Param('madh') madh: string) {
    return await this.lichhenService.findmadh(madh);
  }
  @Get('findsdt/:sdt')
  async findsdt(@Param('sdt') sdt: string) {
    return await this.lichhenService.findsdt(sdt);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.lichhenService.findPagination(page,perPage);
    }
  @Get('findquery')
    async findQuery(@Query('query') query: string){
      return await this.lichhenService.findQuery(query);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLichhenDto: UpdateLichhenDto) {
    return this.lichhenService.update(id, updateLichhenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lichhenService.remove(id);
  }
}