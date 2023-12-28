import { Injectable } from '@nestjs/common';
import { CreateSmDto } from './dto/create-sm.dto';
import { UpdateSmDto } from './dto/update-sm.dto';
import axios from 'axios';

@Injectable()
export class SmsService {
  
  async sendsms(data: any) {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://sms.cmctelecom.vn/SMS_CMCTelecom/api/sms/sendutf',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

   try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return error;
    }
  }
  create(createSmDto: CreateSmDto) {
    return 'This action adds a new sm';
  }

  findAll() {
    return `This action returns all sms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sm`;
  }

  update(id: number, updateSmDto: UpdateSmDto) {
    return `This action updates a #${id} sm`;
  }

  remove(id: number) {
    return `This action removes a #${id} sm`;
  }
}
