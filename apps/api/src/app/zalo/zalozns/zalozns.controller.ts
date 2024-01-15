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
  @Get('getrating/:msgid')
  getRating(@Param('msgid') msgid: string) {
    const result =this.zaloznsService.getRating(msgid);
    return result
  }

  @Get('updatetracking')
  updatetracking() {
    const result =this.zaloznsService.updatetracking();
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
  @Post('search')
    async findQuery(@Body() SearchParams: any){
      return await this.zaloznsService.findQuery(SearchParams);
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