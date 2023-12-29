import { Injectable } from '@nestjs/common';
import { CreateVttechDto } from './dto/create-vttech.dto';
import { UpdateVttechDto } from './dto/update-vttech.dto';
import axios from 'axios';
import { CauhinhchungService } from '../cauhinh/cauhinhchung/cauhinhchung.service';
import { TelegramService } from '../shared/telegram.service';
import { TasksService } from '../tasks/tasks.service';
import { Vttech_khachhangService } from './vttech_khachhang/vttech_khachhang.service';
import moment = require('moment');
@Injectable()
export class VttechService {
  Cookie: any = ''
  XsrfToken: any = ''
  constructor(
    private _CauhinhchungService: CauhinhchungService,
    private _TelegramService: TelegramService,
    private _Vttech_khachhangService: Vttech_khachhangService,
  ) {
    this._CauhinhchungService.findslug('vttechtoken').then((data: any) => {
      this.Cookie = data.Content.Cookie
      this.XsrfToken = data.Content.XsrfToken
    })
  }
  async getAllKhachhang(data: any) {
    const formattedBegin = moment(new Date(data.begin)).format("DD-MM-YYYY");
    const formattedEnd = moment(new Date(data.end)).format("DD-MM-YYYY");
    try {
      const response = await axios.post(
        `https://tmtaza.vttechsolution.com/Customer/ListCustomer/?handler=LoadData&date=${formattedBegin}+to+${formattedEnd}&branchID=${data.brandID}&maxdate=${data.Maxdate}`,
        {},
        {
          headers: {
            Cookie: this.Cookie,
            'Xsrf-Token': this.XsrfToken,
          },
          maxBodyLength: Infinity,
        }
      );
      const existingCustomers = await this._Vttech_khachhangService.findAll();
      const uniqueCustomerPhones = existingCustomers.map((customer) => customer.SDT);
      const newCustomers = response.data.Table1
          .filter((item: { Phone: any; }) => item.Phone)
          .filter((item: { Phone: string; }) => !uniqueCustomerPhones.includes(item.Phone));

      if (newCustomers.length > 0) {
        await Promise.all(
          newCustomers.map(async (newCustomer: { CustName: any; Phone: any; Created: string | number | Date; }) => {
            const createdCustomer = await this._Vttech_khachhangService.create({
              Hoten: newCustomer.CustName,
              Dulieu: JSON.stringify(newCustomer),
              SDT: newCustomer.Phone, // Use Phone property consistently
              idCN: data.brandID,
              Created: new Date(newCustomer.Created),
            });
            console.error(createdCustomer.SDT);
          })
        );
        await this._TelegramService.SendDulieuVttech(
          `Load Dữ Liệu Khách Hàng Vttech Code 201: Cập Nhật Lúc <b><u>${moment().format(
            "HH:mm:ss DD/MM/YYYY"
          )}</u></b> Với Số Lượng: <b><u>${newCustomers.length}</u></b>`
        );
        return { status: 201 };
      } else {
        await this._TelegramService.SendDulieuVttech(
          `Load Dữ Liệu Khách Hàng Vttech Code 200: Cập Nhật Lúc <b><u>${moment().format(
            "HH:mm:ss DD/MM/YYYY"
          )}</u></b> Với Số Lượng: <b><u>0</u></b>`
        );
        return { status: 200 };
      }
    } catch (error) {
      await this._TelegramService.SendDulieuVttech(
        `Lỗi Function Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b>`
      );
      return {
        error: error,
        status: 400,
        title: 'Lỗi Function',
        Cookie: this.Cookie,
        'Xsrf-Token': this.XsrfToken,
      };
    }
  }

  Getdatetime(data: any) {
    const date1 = new Date(data);
    return date1.getTime()
  }
  async GetKHBySDT(data: any) {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://tmtaza.vttechsolution.com/Searching/Searching/?handler=SearchByOption&data=%5B%7B%22name%22%3A%22PHONENUMBER%22%2C%22value%22%3A%22' + data + '%22%7D%5D&CBeginID=0',
      headers: { Cookie: this.Cookie, 'Xsrf-Token': this.XsrfToken },
    };
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  async GetDichVu(CustomerID: any) {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://tmtaza.vttechsolution.com/Customer/Service/TabList/TabList_Service/?handler=LoadataTab&CustomerID=' + CustomerID + '&Record=0&Plan=0&ViewAll=1',
      headers: { Cookie: this.Cookie, 'Xsrf-Token': this.XsrfToken },
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.log(error);
    }

  }
  async GetLichhen(CustomerID: any) {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://tmtaza.vttechsolution.com/Customer/ScheduleList_Schedule/?handler=Loadata&CustomerID=' + CustomerID + '&Limit=10&BeginID=0&IsDelete=0',
      headers: { Cookie: this.Cookie, 'Xsrf-Token': this.XsrfToken },
    };

    try {
      const response = await axios.request(config);
      return response.data;
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.log(error);
    }

  }
  create(createVttechDto: CreateVttechDto) {
    return 'This action adds a new vttech';
  }

  findAll() {
    return `This action returns all vttech`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vttech`;
  }

  update(id: number, updateVttechDto: UpdateVttechDto) {
    return `This action updates a #${id} vttech`;
  }

  remove(id: number) {
    return `This action removes a #${id} vttech`;
  }
}
