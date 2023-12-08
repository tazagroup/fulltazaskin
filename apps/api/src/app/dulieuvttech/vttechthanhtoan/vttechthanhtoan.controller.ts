import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VttechthanhtoanService } from './vttechthanhtoan.service';
import { CreateVttechthanhtoanDto } from './dto/create-vttechthanhtoan.dto';
import { UpdateVttechthanhtoanDto } from './dto/update-vttechthanhtoan.dto';

@Controller('vttechthanhtoan')
export class VttechthanhtoanController {
  constructor(private readonly vttechthanhtoanService: VttechthanhtoanService) {}

  @Post()
  create(@Body() createVttechthanhtoanDto: CreateVttechthanhtoanDto) {
    return this.vttechthanhtoanService.create(createVttechthanhtoanDto);
  }

  @Get()
  findAll() {
    return this.vttechthanhtoanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vttechthanhtoanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVttechthanhtoanDto: UpdateVttechthanhtoanDto) {
    return this.vttechthanhtoanService.update(+id, updateVttechthanhtoanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vttechthanhtoanService.remove(+id);
  }
}
