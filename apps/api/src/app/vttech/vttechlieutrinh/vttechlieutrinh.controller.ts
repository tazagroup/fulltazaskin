import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VttechlieutrinhService } from './vttechlieutrinh.service';
import { CreateVttechlieutrinhDto } from './dto/create-vttechlieutrinh.dto';
import { UpdateVttechlieutrinhDto } from './dto/update-vttechlieutrinh.dto';

@Controller('vttechlieutrinh')
export class VttechlieutrinhController {
  constructor(private readonly vttechlieutrinhService: VttechlieutrinhService) {}

  @Post()
  create(@Body() createVttechlieutrinhDto: CreateVttechlieutrinhDto) {
    return this.vttechlieutrinhService.create(createVttechlieutrinhDto);
  }

  @Get()
  findAll() {
    return this.vttechlieutrinhService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vttechlieutrinhService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVttechlieutrinhDto: UpdateVttechlieutrinhDto) {
    return this.vttechlieutrinhService.update(+id, updateVttechlieutrinhDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vttechlieutrinhService.remove(+id);
  }
}
