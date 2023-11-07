import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KhachhangService } from './khachhang.service';
import { CreateKhachhangDto } from './dto/create-khachhang.dto';
import { UpdateKhachhangDto } from './dto/update-khachhang.dto';

@Controller('khachhang')
export class KhachhangController {
  constructor(private readonly khachhangService: KhachhangService) {}

  @Post()
  create(@Body() createKhachhangDto: CreateKhachhangDto) {
    return this.khachhangService.create(createKhachhangDto);
  }

  @Get()
  findAll() {
    return this.khachhangService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.khachhangService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKhachhangDto: UpdateKhachhangDto) {
    return this.khachhangService.update(+id, updateKhachhangDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.khachhangService.remove(+id);
  }
}
