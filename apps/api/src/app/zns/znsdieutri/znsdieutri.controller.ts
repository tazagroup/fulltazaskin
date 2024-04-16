import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ZnsdieutriService } from './znsdieutri.service';
import { CreateZnsdieutriDto } from './dto/create-znsdieutri.dto';
import { UpdateZnsdieutriDto } from './dto/update-znsdieutri.dto';

@Controller('znsdieutri')
export class ZnsdieutriController {
  constructor(private readonly znsdieutriService: ZnsdieutriService) {}

  @Post()
  create(@Body() createZnsdieutriDto: CreateZnsdieutriDto) {
    return this.znsdieutriService.create(createZnsdieutriDto);
  }

  @Get()
  findAll() {
    return this.znsdieutriService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.znsdieutriService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateZnsdieutriDto: UpdateZnsdieutriDto) {
    return this.znsdieutriService.update(+id, updateZnsdieutriDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.znsdieutriService.remove(+id);
  }
}
