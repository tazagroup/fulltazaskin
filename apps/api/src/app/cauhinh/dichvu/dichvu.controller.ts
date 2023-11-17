import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import {DichvuService } from './dichvu.service';
import { CreateDichvuDto } from './dto/create-dichvu.dto';
import { UpdateDichvuDto } from './dto/update-dichvu.dto';
@Controller('dichvu')
export class DichvuController {
  constructor(private readonly dichvuService:DichvuService) {}

  @Post()
  create(@Body() createDichvuDto: CreateDichvuDto) {
    return this.dichvuService.create(createDichvuDto);
  }
  @Get()
  findAll() {
    return this.dichvuService.findAll();
  }
  @Get('findid/:id')
  findOne(@Param('id') id: string) {
    return this.dichvuService.findid(id);
  }
  @Get('findslug/:slug')
  findslug(@Param('slug') slug: string) {
    return this.dichvuService.findslug(slug);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDichvuDto: UpdateDichvuDto) {
    return this.dichvuService.update(id, updateDichvuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dichvuService.remove(id);
  }
}

