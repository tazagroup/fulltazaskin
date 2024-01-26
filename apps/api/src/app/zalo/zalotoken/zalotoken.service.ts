import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateZalotokenDto } from './dto/create-zalotoken.dto';
import { UpdateZalotokenDto } from './dto/update-zalotoken.dto';
import { ZalotokenEntity } from './entities/zalotoken.entity';
const axios = require('axios');
@Injectable()
export class ZalotokenService {
  constructor(
    @InjectRepository(ZalotokenEntity)
    private ZalotokenRepository: Repository<ZalotokenEntity>
  ) { }
  async getAccessToken(item: any) {
    const options = {
      method: 'POST',
      url: 'https://oauth.zaloapp.com/v4/oa/access_token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'secret_key': item.secret_key,
      },
      data: {
        code: item.code,
        app_id: item.app_id,
        grant_type: 'authorization_code',
      },
    };
    return axios(options)
      .then((response:any) => {
        console.error(response.data);
        if (response.data.error == '-14019') {
          return { status: 400, note: "Autho Code Hết Hạn" }
        }
        else {
          return this.findbyoaid(item.oa_id).then((res: any) => {
            if (res) {
              const res1 = { ...res }
              res1.Token = response.data
              res1.AuthenAt = new Date()
              res1.AuthenEnd = new Date(res1.AuthenAt.getTime() + 90000 * 1000);
              this.update(res1.id, res1)
              return { status: 200, note: "Xác Thực Thành Công" }
            }
            else {
              return { status: 400, note: "Chứa Có Oa Trên Server" }
            }
          })
        }
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  }
  async getrefreshToken(item: any) {
    const options = {
      method: 'POST',
      url: 'https://oauth.zaloapp.com/v4/oa/access_token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'secret_key': item.secret_key,
      },
      data: {
        refresh_token: item.refresh_token,
        app_id: item.app_id,
        grant_type: 'refresh_token',
      },
    };
    return axios(options)
      .then((response) => {
        console.error(response.data);
        if (response.data.error == '-14014') {
          return { status: 400, note: "Refesh Token Không Đúng" }
        }
        else if (response.data.error == '-14020') {
          return { status: 400, note: "Refesh Token Hết Hạn" }
        }
        else {
          return this.findbyoaid(item.oa_id).then((res: any) => {
            if (res) {
              const res1 = { ...res }
              res1.Token = response.data
              res1.AuthenAt = new Date()
              res1.AuthenEnd = new Date(res1.AuthenAt.getTime() + 90000 * 1000);
              this.update(res1.id, res1)
              return { status: 200, note: "Gia Hạn Thành Công" }
            }
            else {
              return { status: 400, note: "Chứa Có Oa Trên Server" }
            }
          })
        }
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
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
