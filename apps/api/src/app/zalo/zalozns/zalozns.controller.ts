import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import {ZaloznsService } from './zalozns.service';
import { Cron, Interval } from '@nestjs/schedule';
import { GenId, convertPhoneNum } from '../../shared.utils';
import * as moment from 'moment';
import axios from 'axios';
import request from 'request';
import { HttpService } from '@nestjs/axios';
@Controller('zalozns')
export class ZaloznsController {
  ListSDT:any[] = ['0559723718','0967325012','0706974014','0359819001','0585839753','0901407430','0934396797','0977272967','0786810434']
  constructor(private readonly zaloznsService:ZaloznsService,
    private readonly httpService: HttpService) {}
  @Post('webhook')
  async getwebhook(@Req() req: Request): Promise<any> {
    return this.zaloznsService.createzns(req);
   }
   //1s = 1000
  //@Interval(300000)
  @Post('sendzns')
  sendZns(@Body() data: any) {     
    const result =this.zaloznsService.sendZns(data,'');
    return result
  }
//  @Cron('0 0 09 * * *')
  @Post('auto9')
  Auto9sendZns() {     
    this.ListSDT.forEach(v => {
      const Test = {
      // "mode": "development",
      "phone": convertPhoneNum(v),
      "template_id": "272889",
      "template_data": {
          "customer_name": v,
          "schedule_date": moment(new Date()).format("DD/MM/YYYY")
       },
      "tracking_id":GenId(8,true)
     }
      const result =this.zaloznsService.sendZns(Test,'e4d7426e-53df-4285-be74-aba10259e188');
      console.error(result);
      console.error(moment(new Date()).format("hh:mm:ss"));
    });
  }
  // @Cron('0 0 15 * * *')
  @Post('auto15')
  Auto15sendZns() {     
    this.ListSDT.forEach(v => {
      const Test = {
      // "mode": "development",
      "phone": convertPhoneNum(v),
      "template_id": "272889",
      "template_data": {
          "customer_name": v,
          "schedule_date": moment(new Date()).format("DD/MM/YYYY")
       },
      "tracking_id":GenId(8,true)
     }
      const result =this.zaloznsService.sendZns(Test,'e4d7426e-53df-4285-be74-aba10259e188');
      console.error(result);
      console.error(moment(new Date()).format("hh:mm:ss"));
    });
  }
  @Get('getrating/:msgid')
  getRating(@Param('msgid') msgid: string) {
    const result =this.zaloznsService.getRating(msgid);
    return result
  }
  @Get('getallteamplate')
  async getallteamplate() {
   console.error("Call");
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://business.openapi.zalo.me/template/all?offset=0&limit=100&status=1',
      headers: { 
        'access_token': 'dxMJFqT_t12RkvywH7NU7fYmcJ93OgTWyF7bBtTC_43MtxqCSqwbSkhuv1ngDFT7jRtLCcrqu1xt_TbdIc3SIfFlv00sGQ1Kdk-T6avVdqpIyAqHGcYqFiVmZa1cDPrlsV-lC6WwZ1_rhSb2PYlf5kg1s5nf6COosPxvNtzK_nJRpDWnI07wG8o_speF1jPLehRjC38GyrsTZi0mC0BS7foccYyvEAj7XPReCmeh_XoaeBz590onDvkAYqWS8QHchvdZ4oCBh3cumvDD7bIo8fN6ar0TSRq7cUI8RqbfjXxgn_5lLap0EjRatMD9VVaDzDJRSYLhWIIFeRaA56c69ShVmrqNLuSOji-zRMPYWJtXqRKNSbMkPD2SYJ9KJROPq-ICJ7LCi6Znmh0kStEA0kdyTnn2PzKN'
      }
    };
   try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error(error);
    }    
  }
  @Get('getteamplatedetail/:id')
  async getteamplatedetail(@Param('id') id: string) {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://business.openapi.zalo.me/template/info?template_id=${id}`,
      headers: { 
        'access_token': 'FKbgSKoUd14vHsPqJvIU7pfCO7n8WvbCQmqJA6-QkqzU6KTOKh3THZyyK48IbUfOOaDjMcRBzcTMNsv4Jl3APtHoKKmDwQv8AdijU1pnct8nUsrkEk-RMKaxP6jWYCaEQnfFDbAhpXPGB4meGvtwDZOcOIT6bPSkQZXkDro8mozO04W5JAos94KRAKDeb9HaV1DkSGoKzKmuAWfI3OwRDIWR7oa1oPiKEM05T4p5e71FGIeEMzdJ1In191u9pvDwU4SEJtJya2vYTnzDT_A9Vr4gAqHTfwDMVZOyCrBcdZTMI34USFwz9dzKApXbxB0zL6af15Ncg0WZInnh6yk5KY9-PYmlyUKv17bD3XBJyJSUPM0c6EMV73SyAo40wRmK3r0O0XRUcnW4JGOiFTQ4E2T56In0uSvJIOQL5W'
      }
    };
    
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.log(error);
    }    
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