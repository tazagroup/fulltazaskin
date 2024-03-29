import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ZaloappuudaiService } from './zaloappuudai.service';
import { CreateZaloappuudaiDto } from './dto/create-zaloappuudai.dto';
import { UpdateZaloappuudaiDto } from './dto/update-zaloappuudai.dto';

@Controller('zaloappuudai')
export class ZaloappuudaiController {
  constructor(private readonly zaloappuudaiService: ZaloappuudaiService) {}

  @Post()
  create(@Body() createZaloappuudaiDto: CreateZaloappuudaiDto) {
    return this.zaloappuudaiService.create(createZaloappuudaiDto);
  }

  @Get()
  findAll() {
    return this.zaloappuudaiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.zaloappuudaiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateZaloappuudaiDto: UpdateZaloappuudaiDto) {
    return this.zaloappuudaiService.update(+id, updateZaloappuudaiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zaloappuudaiService.remove(+id);
  }
}
