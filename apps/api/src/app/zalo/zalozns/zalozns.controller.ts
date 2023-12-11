import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import {ZaloznsService } from './zalozns.service';
import { Interval } from '@nestjs/schedule';
@Controller('zalozns')
export class ZaloznsController {
  constructor(private readonly zaloznsService:ZaloznsService) {}
  @Post('webhook')
  async getwebhook(@Req() req: Request): Promise<any> {
    return this.zaloznsService.createzns(req);
   }
  // @Interval(60000)
  @Post('sendZns')
  sendZns(@Body() data: any) {     
    const Today =new Date()
    // const Test = {
    //   // "mode": "development",
    //   "phone": "84934107703",
    //   "template_id": "272889",
    //   "template_data": {
    //       "customer_name": "Anh Tuấn",
    //       "schedule_date": "09/12/2023"
    //    },
    //   "tracking_id":Today.getTime()
    // }
    const result =this.zaloznsService.sendZns(data);
    console.error(result);
    return result
  }
  @Get('getrating/:msgid')
  getRating(@Param('msgid') msgid: string) {
    const result =this.zaloznsService.getRating(msgid);
    console.error(result);
    return result
  }
  @Post()
  create(@Body() createZaloznsDto: any) {
    return this.zaloznsService.create(createZaloznsDto);
  }
  @Get()
  async findAll() {
    return await this.zaloznsService.findAll();
  }
  @Get('findid/:id')
  async findOne(@Param('id') id: string) {
    return await this.zaloznsService.findid(id);
  }
  @Get('findslug/:slug')
  async findslug(@Param('slug') slug: string) {
    return await this.zaloznsService.findslug(slug);
  }
  @Get('pagination')
  async findPagination(@Query('page') page: number,@Query('perPage') perPage: number){
       return await this.zaloznsService.findPagination(page,perPage);
    }
  @Get('findquery')
    async findQuery(@Query('query') query: string){
      return await this.zaloznsService.findQuery(query);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateZaloznsDto: any) {
    return this.zaloznsService.update(id, updateZaloznsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zaloznsService.remove(id);
  }
}