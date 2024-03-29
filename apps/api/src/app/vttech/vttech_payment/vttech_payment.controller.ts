import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VttechpaymentService } from './vttech_payment.service';
@Controller('vttechpayment')
export class VttechpaymentController {
  constructor(private readonly vttechpaymentService:VttechpaymentService) {}

  @Post()
  create(@Body() data: any) {
    return this.vttechpaymentService.create(data);
  }
  @Get()
  async findAll() {
    return await this.vttechpaymentService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.vttechpaymentService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.vttechpaymentService.findslug(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.vttechpaymentService.findPagination(page,perPage);
    }
  @Post('search')
    async findQuery(@Body() SearchParams: any){
      return await this.vttechpaymentService.findQuery(SearchParams);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.vttechpaymentService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vttechpaymentService.remove(id);
  }
}