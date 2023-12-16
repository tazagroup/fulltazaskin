import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {ZalotokenService } from './zalotoken.service';
import { CreateZalotokenDto } from './dto/create-zalotoken.dto';
import { UpdateZalotokenDto } from './dto/update-zalotoken.dto';
@Controller('zalotoken')
export class ZalotokenController {
  constructor(private readonly zalotokenService:ZalotokenService) {}

  @Post('get_accesstoken')
  getAccessToken(@Body() data: any) {
    return this.zalotokenService.getAccessToken(data);
  }
  @Post('get_refreshtoken')
  getrefreshToken(@Body() data: any) {
    return this.zalotokenService.getrefreshToken(data);
  }
  @Post()
  create(@Body() createZalotokenDto: CreateZalotokenDto) {
    return this.zalotokenService.create(createZalotokenDto);
  }
  @Get()
  async findAll() {
    return await this.zalotokenService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.zalotokenService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.zalotokenService.findslug(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.zalotokenService.findPagination(page,perPage);
    }
  @Get('findquery')
    async findQuery(@Query('query') query: string){
      return await this.zalotokenService.findQuery(query);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateZalotokenDto: UpdateZalotokenDto) {
    return this.zalotokenService.update(id, updateZalotokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zalotokenService.remove(id);
  }
}