import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {VttechlieutrinhService } from './vttechlieutrinh.service';
import { CreateVttechlieutrinhDto } from './dto/create-vttechlieutrinh.dto';
import { UpdateVttechlieutrinhDto } from './dto/update-vttechlieutrinh.dto';
@Controller('vttechlieutrinh')
export class VttechlieutrinhController {
  constructor(private readonly vttechlieutrinhService:VttechlieutrinhService) {}

  @Post()
  create(@Body() createVttechlieutrinhDto: CreateVttechlieutrinhDto) {
    return this.vttechlieutrinhService.create(createVttechlieutrinhDto);
  }
  @Get()
  async findAll() {
    return await this.vttechlieutrinhService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.vttechlieutrinhService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.vttechlieutrinhService.findslug(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.vttechlieutrinhService.findPagination(page,perPage);
    }
  @Post('search')
    async findQuery(@Body() SearchParams: any){
      return await this.vttechlieutrinhService.findQuery(SearchParams);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVttechlieutrinhDto: UpdateVttechlieutrinhDto) {
    return this.vttechlieutrinhService.update(id, updateVttechlieutrinhDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vttechlieutrinhService.remove(id);
  }
}