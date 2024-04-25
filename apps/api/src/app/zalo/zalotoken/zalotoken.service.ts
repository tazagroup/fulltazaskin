import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateZalotokenDto } from './dto/create-zalotoken.dto';
import { UpdateZalotokenDto } from './dto/update-zalotoken.dto';
import { ZalotokenEntity } from './entities/zalotoken.entity';
import { ChinhanhService } from '../../cauhinh/chinhanh/chinhanh.service';
import { TelegramService } from '../../shared/telegram.service';
const axios = require('axios');
@Injectable()
export class ZalotokenService {
  constructor(
    @InjectRepository(ZalotokenEntity)
    private ZalotokenRepository: Repository<ZalotokenEntity>,
    private _ChinhanhService: ChinhanhService,
    private _TelegramService: TelegramService
  ) { }
  async getAccessToken(item: any) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'secret_key': item.ZaloOa.secret_key,
      },
      data: new URLSearchParams({
        code: item.code,
        app_id: item.ZaloOa.app_id,
        grant_type: 'authorization_code',
      }),
    };
    try {
      const response = await axios.post('https://oauth.zaloapp.com/v4/oa/access_token', options);
      const data = response.data;
      return data
      if(data.error == '0')
        {
            delete item.code;
            item.ZaloOaToken = data;
            item.ZaloOaToken.AuthenAt = new Date();
            item.ZaloOaToken.AuthenEnd = new Date(item.ZaloOaToken.AuthenAt.getTime() + 90000 * 1000);
            const result = await this._ChinhanhService.update(item.id, item);
            this._TelegramService.SendMiniAppLogdev(`Đã cập nhật lại token cho chi nhánh ${item.Title}`);
            return { status: 200, note: "Xác Thực Thành Công", data: result };
        }
      else {
        item.ZaloOaToken = {};
        const result = await this._ChinhanhService.update(item.id, item);
        this._TelegramService.SendMiniAppLogdev(`Đã cập nhật lại token cho chi nhánh ${item.Title} - ${data.error}`);
        return { status: 400, note: "Autho Code Hết Hạn" };
      } 
    } catch (error) {
      // Handle error
      console.error(error);
    }
  }


  async getrefreshToken(item: any) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'secret_key': item.ZaloOa.secret_key,
      },
      data: new URLSearchParams({
        refresh_token: item.ZaloOaToken.refresh_token,
        app_id: item.ZaloOa.app_id,
        grant_type: 'refresh_token',
      }),
    };
    try {
      const response = await axios.post('https://oauth.zaloapp.com/v4/oa/access_token', options);
      const data = response.data;
      console.error(data);
      if(data.error == '0')
        {
          item.ZaloOaToken = data;
          item.ZaloOaToken.AuthenAt = new Date();
          item.ZaloOaToken.AuthenEnd = new Date(item.ZaloOaToken.AuthenAt.getTime() + 90000 * 1000);
          const result = await this._ChinhanhService.update(item.id, item);
          this._TelegramService.SendMiniAppLogdev(`Đã refresg token cho chi nhánh ${item.Title}`);
          return { status: 200, note: "Gia Hạn Thành Công", data: result };
        }
      else {
        item.ZaloOaToken = {};
        const result = await this._ChinhanhService.update(item.id, item);
        this._TelegramService.SendMiniAppLogdev(`Đã refresg token cho chi nhánh ${item.Title} - ${data.error}`);
        return { status: 400, note: "Refesh Token Không Đúng" };
      }
    } catch (error) {
      // Handle error
      console.error(error);
    }
  }


  async create(CreateZalotokenDto: CreateZalotokenDto) {
    this.ZalotokenRepository.create(CreateZalotokenDto);
    return await this.ZalotokenRepository.save(CreateZalotokenDto);
  }
  async findAll() {
    return await this.ZalotokenRepository.find();
  }
  async findid(id: string) {
    return await this.ZalotokenRepository.findOne({
      where: { id: id },

    });
  }
  async findbyoaid(oaid: string) {
    return await this.ZalotokenRepository.findOne({
      where: { oa_id: oaid },
    });
  }
  async findslug(slug: any) {
    return await this.ZalotokenRepository.findOne({
      where: { Slug: slug },
    });
  }
  async findPagination(page: number, perPage: number) {
    const skip = (page - 1) * perPage;
    const totalItems = await this.ZalotokenRepository.count();
    const zalotokens = await this.ZalotokenRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: zalotokens,
    };
  }
  async findQuery(query: string) {
    return await this.ZalotokenRepository.find({
      where: { Title: Like(`%query%`) },
    });
  }
  async update(id: string, UpdateZalotokenDto: UpdateZalotokenDto) {
    this.ZalotokenRepository.save(UpdateZalotokenDto);
    return await this.ZalotokenRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.ZalotokenRepository.delete(id);
    return { deleted: true };
  }
}
