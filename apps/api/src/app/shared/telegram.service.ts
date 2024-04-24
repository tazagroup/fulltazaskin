import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { environment } from '../../environments/environment';
import axios from 'axios';
@Injectable()
export class TelegramService {
  constructor() {}
  async SendNoti(data: string): Promise<any> {
    const options = {
      url: `https://api.telegram.org/bot${environment.APITelegram_accesstoken}/sendMessage?chat_id=${environment.APITelegram_idGroup}&text=${data}&parse_mode=html`,
    };
    const response = await axios.request(options);
    return response.data;
  }
  async SendLogdev(data: any): Promise<any> {
    const options = {
      url: `https://api.telegram.org/bot${environment.APITelegram_accesstoken}/sendMessage?chat_id=${environment.APITelegram_Logdev}&text=${data}&parse_mode=html`,
    };
    const response = await axios.request(options);
    return response.data;
  }
  async SendMiniAppLogdev(data: any): Promise<any> {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: environment.APITelegram_LogMiniApp,
        text: data,
        parse_mode: 'html',
      }),
    };
    //fetch telegram
    const response = await fetch(`https://api.telegram.org/bot${environment.APITelegram_accesstoken}/sendMessage`, options);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    return response.json();
  }
  async SendDulieuVttech(data: string): Promise<any> {
    const options = {
      url: `https://api.telegram.org/bot${environment.APITelegram_accesstoken}/sendMessage?chat_id=${environment.APITelegram_LogVttech}&text=${data}&parse_mode=html`,
    };
    const response = await axios.request(options);
    return response.data;
  }
}
