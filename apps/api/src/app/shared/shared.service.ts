import { Injectable } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import moment = require('moment');
import axios from 'axios';
@Injectable()
export class SharedService {
  constructor(private _TelegramService:TelegramService) {}
  async getToken(item: any) {
    try {
      const response = await axios.post('https://apismsvtt.vttechsolution.com/api/Client/Autho', item && typeof item === 'object' && Object.keys(item).length > 0 ? item : {"Name": "Taza","Password": "1b9287d492b256x7taza","Type": "web"}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = response.data;
      const cookies = response.headers['set-cookie'];
      switch (data.Status) {
        case 1:
          return [data, cookies];
        default:
          this._TelegramService.SendMiniAppLogdev(`Lỗi Xác Thực ${JSON.stringify(item)} Vttech ${moment().format("HH:mm:ss DD/MM/YYYY")}`);
          return data;
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // Retry after 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));
        return this.getToken(item);
      }
      return this._TelegramService.SendMiniAppLogdev(`Lỗi Xác Thực ${error} Vttech ${moment().format("HH:mm:ss DD/MM/YYYY")}`);
    }
  }
}
