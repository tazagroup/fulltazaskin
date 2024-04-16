import { Injectable } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import moment = require('moment');
@Injectable()
export class SharedService {
  constructor(private _TelegramService:TelegramService) {}
  async getToken(item: any) { 
    try {
      const response = await fetch('https://apismsvtt.vttechsolution.com/api/Client/Autho', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: item && typeof item === 'object' && Object.keys(item).length > 0 ? JSON.stringify(item) : JSON.stringify({"Name": "Taza","Password": "1b9287d492b256x7taza","Type": "web"}),
      });
      const data = await response.json();
      const cookies = response.headers.get('set-cookie');
      switch (data.Status) {
        case 1:
          return [data,cookies];
        default:
          this._TelegramService.SendMiniAppLogdev(`Lỗi Xác Thực ${JSON.stringify(item)} Vttech ${moment().format("HH:mm:ss DD/MM/YYYY")}`);
          return data
      }
    } catch (error) {
     return  this._TelegramService.SendMiniAppLogdev(`Lỗi Xác Thực ${error} Vttech ${moment().format("HH:mm:ss DD/MM/YYYY")}`);
    }
  }
}
