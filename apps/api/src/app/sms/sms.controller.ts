import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SmsService } from './sms.service';
import { CreateSmDto } from './dto/create-sm.dto';
import { UpdateSmDto } from './dto/update-sm.dto';
import axios from 'axios';
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) { }

  @Post('sendsms')
  sendsms(@Body() data: any) {
    // let item = JSON.stringify({
    //   "Brandname": "TAZA",
    //   "Message": "It Test",
    //   "Phonenumber": "0977272967",
    //   "user": "ctytaza2",
    //   "pass": "$2a$10$QjKAPJ9qq.RuS3jfUID2FeuGdpuSL1Rl9ugQUvy.O5PuKSlp8z95S",
    //   "messageId": "0977272967"
    // });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://sms.cmctelecom.vn/SMS_CMCTelecom/api/sms/send',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(data)
    };

   return axios.request(config)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return error
      });
  }
  @Post()
  create(@Body() createSmDto: CreateSmDto) {
    return this.smsService.create(createSmDto);
  }

  @Get()
  findAll() {
    return this.smsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.smsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSmDto: UpdateSmDto) {
    return this.smsService.update(+id, updateSmDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.smsService.remove(+id);
  }
}
