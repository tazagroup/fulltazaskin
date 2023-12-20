import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VttechService } from './vttech.service';
import { CreateVttechDto } from './dto/create-vttech.dto';
import { UpdateVttechDto } from './dto/update-vttech.dto';

@Controller('vttech')
export class VttechController {
  constructor(private readonly vttechService: VttechService) {}

  @Post()
  create(@Body() createVttechDto: CreateVttechDto) {
    return this.vttechService.create(createVttechDto);
  }
  @Get('findSDT/:SDT')
  GetKHBySDT(@Param('SDT') SDT: string) {
    return this.vttechService.GetKHBySDT(SDT);
  }
  @Get('dichvu/:CUSID')
  GetDichVu(@Param('CUSID') CUSID: string) {
    return this.vttechService.GetDichVu(CUSID);
  }
  @Get('lichhen/:CUSID')
  GetLichhen(@Param('CUSID') CUSID: string) {
    return this.vttechService.GetDichVu(CUSID);
  }

  @Get()
  findAll() {
    return this.vttechService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vttechService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVttechDto: UpdateVttechDto) {
    return this.vttechService.update(+id, updateVttechDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vttechService.remove(+id);
  }
}
