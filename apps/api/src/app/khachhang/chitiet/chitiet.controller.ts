import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ChitietService } from './chitiet.service';
import { CreateChitietDto } from './dto/create-chitiet.dto';
import { UpdateChitietDto } from './dto/update-chitiet.dto';

@Controller('khachhangs/chitiet')
export class ChitietController {
  constructor(private readonly chitietService: ChitietService) {}

  @Post()
  create(@Body() createChitietDto: CreateChitietDto) {
    return this.chitietService.create(createChitietDto);
  }
  @Get()
  findAll() {
    return this.chitietService.findAll();
  }
  @Get('count')
  findCount() {
    return this.chitietService.findCount();
  }
  @Get('findsdt/:sdt')
  findOne(@Param('sdt') sdt: string) {
    return this.chitietService.findBySDT(sdt);
  }
  @Get('paged')
  Loadmore(
    @Query('Chinhanh') Chinhanh: string,
    ) {
    return this.chitietService.findByChinhanh(Chinhanh);
  }
  @Get('paged')
  LoadByDay(
    @Query('batdau') batdau: Date,
    @Query('kethuc') kethuc: Date,
    ) {
      return this.chitietService.findByDay(batdau,kethuc);
  }
  @Get('findpaged')
  findpaged(
    @Query('take') take: any,
    @Query('skip') skip: any,
    ) {
      return this.chitietService.findpaged(skip,take);
  }
  @Get('paged')
  LoadSDT(@Query('SDT') SDT: string) {
      return this.chitietService.findBySDT(SDT);
  }
  @Get('paged')
  LoadTenKH(@Query('TenKH') TenKH: string) {
      return this.chitietService.findByTenKH(TenKH);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChitietDto: UpdateChitietDto) {
    return this.chitietService.update(id, updateChitietDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chitietService.remove(id);
  }
}
