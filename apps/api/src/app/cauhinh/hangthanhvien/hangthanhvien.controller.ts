import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {HangthanhvienService } from './hangthanhvien.service';
import { CreateHangthanhvienDto } from './dto/create-hangthanhvien.dto';
import { UpdateHangthanhvienDto } from './dto/update-hangthanhvien.dto';
@Controller('hangthanhvien')
export class HangthanhvienController {
  constructor(private readonly hangthanhvienService:HangthanhvienService) {}

  @Post()
  create(@Body() createHangthanhvienDto: CreateHangthanhvienDto) {
    return this.hangthanhvienService.create(createHangthanhvienDto);
  }
  @Get()
  async findAll() {
    return await this.hangthanhvienService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.hangthanhvienService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.hangthanhvienService.findslug(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.hangthanhvienService.findPagination(page,perPage);
    }
  @Get('findquery')
    async findQuery(@Query('query') query: string){
      return await this.hangthanhvienService.findQuery(query);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHangthanhvienDto: UpdateHangthanhvienDto) {
    return this.hangthanhvienService.update(id, updateHangthanhvienDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hangthanhvienService.remove(id);
  }
}