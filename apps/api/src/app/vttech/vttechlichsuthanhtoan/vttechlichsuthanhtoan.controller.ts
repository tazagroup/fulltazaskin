import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VttechlichsuthanhtoanService } from './vttechlichsuthanhtoan.service';
import { CreateVttechlichsuthanhtoanDto } from './dto/create-vttechlichsuthanhtoan.dto';
import { UpdateVttechlichsuthanhtoanDto } from './dto/update-vttechlichsuthanhtoan.dto';

@Controller('vttechlichsuthanhtoan')
export class VttechlichsuthanhtoanController {
  constructor(private readonly vttechlichsuthanhtoanService: VttechlichsuthanhtoanService) {}

  @Post()
  create(@Body() createVttechlichsuthanhtoanDto: CreateVttechlichsuthanhtoanDto) {
    return this.vttechlichsuthanhtoanService.create(createVttechlichsuthanhtoanDto);
  }

  @Get()
  findAll() {
    return this.vttechlichsuthanhtoanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vttechlichsuthanhtoanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVttechlichsuthanhtoanDto: UpdateVttechlichsuthanhtoanDto) {
    return this.vttechlichsuthanhtoanService.update(+id, updateVttechlichsuthanhtoanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vttechlichsuthanhtoanService.remove(+id);
  }
}
