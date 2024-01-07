import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {LoggerService } from './logger.service';
import { CreateLoggerDto } from './dto/create-logger.dto';
import { UpdateLoggerDto } from './dto/update-logger.dto';
@Controller('logger')
export class LoggerController {
  constructor(private readonly loggerService:LoggerService) {}

  @Post()
  create(@Body() createLoggerDto: CreateLoggerDto) {
    return this.loggerService.create(createLoggerDto);
  }
  @Get()
  async findAll() {
    return await this.loggerService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.loggerService.findid(id);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.loggerService.findPagination(page,perPage);
    }
  @Post('search')
    async findQuery(@Body() SearchParams: any){
      return await this.loggerService.findQuery(SearchParams);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoggerDto: UpdateLoggerDto) {
    return this.loggerService.update(id, updateLoggerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loggerService.remove(id);
  }
}