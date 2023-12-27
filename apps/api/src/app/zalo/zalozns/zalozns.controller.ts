import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import {ZaloznsService } from './zalozns.service';
import { Cron, Interval } from '@nestjs/schedule';
import { GenId, convertPhoneNum } from '../../shared.utils';
import * as moment from 'moment';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { ZalotokenService } from '../zalotoken/zalotoken.service';
@Controller('zalozns')
export class ZaloznsController {
  ListSDT:any[] = ['0559723718','0967325012','0706974014','0359819001','0585839753','0901407430','0934396797','0977272967','0786810434']
  constructor(
    private readonly zaloznsService:ZaloznsService,
    private _ZalotokenService: ZalotokenService,
    private readonly httpService: HttpService) {}
  @Post('webhook')
  async getwebhook(@Req() req: Request): Promise<any> {
    return this.zaloznsService.createzns(req);
   }
  // @Post('sendtestzns')
  // sendtestzns(@Body() data: any) {   
  //   const result =this.zaloznsService.sendtestzns(data,data);
  //   return result
  // }
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
  // @Post('auto9')
  // Auto9sendZns() {     
  //   this.ListSDT.forEach(v => {
  //     const Test = {
  //     // "mode": "development",
  //     "phone": convertPhoneNum(v),
  //     "template_id": "272889",
  //     "template_data": {
  //         "customer_name": v,
  //         "schedule_date": moment(new Date()).format("DD/MM/YYYY")
  //      },
  //     "tracking_id":GenId(8,true)
  //    }
  //     const result =this.zaloznsService.sendZns(Test,'e4d7426e-53df-4285-be74-aba10259e188');
  //     console.error(result);
  //     console.error(moment(new Date()).format("hh:mm:ss"));
  //   });
  // }
  @Get('getrating/:msgid')
  getRating(@Param('msgid') msgid: string) {
    const result =this.zaloznsService.getRating(msgid);
    return result
  }

  @Get('alltemp/:id')
  async getallteamplate(@Param('id') id: string) {
    const ZaloTokenPromise = await this._ZalotokenService.findid(id)
    const [Zalotoken] = await Promise.all([ZaloTokenPromise])    
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://business.openapi.zalo.me/template/all?offset=0&limit=100&status=1',
      headers: { 
        'access_token': Zalotoken.Token['access_token']
      }
    };
   try {
      const response = await axios.request(config);   
      response.data['token']= Zalotoken.Token['access_token']
      return response.data;
    } catch (error) {
      console.error(error);
    }    
  }
  @Get('tempdetail')
  async getteamplatedetail(@Query('id') id: any,@Query('token') token: any) {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://business.openapi.zalo.me/template/info?template_id=${id}`,
      headers: { 
        'access_token': token
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