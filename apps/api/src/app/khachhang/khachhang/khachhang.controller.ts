import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { KhachhangService } from './khachhang.service';
import { CreateKhachhangDto } from './dto/create-khachhang.dto';
import { UpdateKhachhangDto } from './dto/update-khachhang.dto';

@Controller('khachhangs/khachhang')
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
  // @Get(':Chinhanh')
  // findByChinhanh(@Param('Chinhanh') Chinhanh: string) {
  //   return this.khachhangService.findByChinhanh(Chinhanh);
  // }
  @Get('paged')
  LoadSDT(@Query('SDT') SDT: string) {
      return this.khachhangService.findBySDT(SDT);
  }
  @Get('paged')
  LoadTenKH(@Query('TenKH') TenKH: string) {
      return this.khachhangService.findByTenKH(TenKH);
  }
  @Get('findpaged')
  findpaged(
    @Query('take') take: any,
    @Query('skip') skip: any,
    ) 
    {
       return this.khachhangService.findpaged(skip,take);
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
