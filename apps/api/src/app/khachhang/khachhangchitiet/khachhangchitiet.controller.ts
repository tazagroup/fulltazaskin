import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import {KhachhangchitietService } from './khachhangchitiet.service';
import { CreateKhachhangchitietDto } from './dto/create-khachhangchitiet.dto';
import { UpdateKhachhangchitietDto } from './dto/update-khachhangchitiet.dto';
@Controller('khachhangchitiet')
export class KhachhangchitietController {
  constructor(private readonly khachhangchitietService:KhachhangchitietService) {}

  @Post()
  create(@Body() createKhachhangchitietDto: CreateKhachhangchitietDto) {
    return this.khachhangchitietService.create(createKhachhangchitietDto);
  }
  @Get()
  findAll() {
    return this.khachhangchitietService.findAll();
  }
  @Get('findid/:id')
  findOne(@Param('id') id: string) {
    return this.khachhangchitietService.findid(id);
  }
  @Get('findslug/:slug')
  findslug(@Param('slug') slug: string) {
    return this.khachhangchitietService.findslug(slug);
  }
  @Get('findsdt/:sdt')
  findsdt(@Param('sdt') sdt: string) {
    return this.khachhangchitietService.findsdt(sdt);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKhachhangchitietDto: UpdateKhachhangchitietDto) {
    return this.khachhangchitietService.update(id, updateKhachhangchitietDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.khachhangchitietService.remove(id);
  }
}

