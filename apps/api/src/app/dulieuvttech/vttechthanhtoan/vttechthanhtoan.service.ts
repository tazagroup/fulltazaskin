import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { CreateVttechthanhtoanDto } from './dto/create-vttechthanhtoan.dto';
import { UpdateVttechthanhtoanDto } from './dto/update-vttechthanhtoan.dto';
import { VttechthanhtoanEntity } from './entities/vttechthanhtoan.entity';
import axios from 'axios';
import { Cron, Interval } from '@nestjs/schedule';
import { CauhinhchungService } from '../../cauhinh/cauhinhchung/cauhinhchung.service';
import { environment } from 'apps/api/src/environments/environment';
import * as moment from 'moment';
import { TasksService } from '../../tasks/tasks.service';
import { TelegramService } from '../../shared/telegram.service';
@Injectable()
export class VttechthanhtoanService {
  Cookie: any = ''
  XsrfToken: any = ''
  constructor(
    @InjectRepository(VttechthanhtoanEntity)
    private VttechthanhtoanRepository: Repository<VttechthanhtoanEntity>,
    private _CauhinhchungService: CauhinhchungService,
    // private _TasksService: TasksService,
    private _TelegramService: TelegramService,
  ) {
    this._CauhinhchungService.findslug('vttechtoken').then((data: any) => {
      this.Cookie = data.Content.Cookie
      this.XsrfToken = data.Content.XsrfToken
    })
  }
    async getApiRealtime() {
    console.log('todo');
    const begin = moment(new Date()).format("DD-MM-YYYY")
    const end = moment(new Date()).add(1, 'day').format("DD-MM-YYYY")
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://tmtaza.vttechsolution.com/Report/Revenue/Branch/AllBranchGrid/?handler=LoadataDetailByBranch&branchID=0&dateFrom=${begin}&dateTo=${end}`,
      headers: { Cookie: this.Cookie, 'Xsrf-Token': this.XsrfToken },
    };
    try {
      const response = await axios.request(config);
      if(Array.isArray(response.data))
      {
        const data1 = response.data;
        const data2 = await this.findAll();
        const uniqueInData2 = data1.filter((item: { Created: any; }) => !data2.some((data1Item) => this.Getdatetime(data1Item.Created) === this.Getdatetime(item.Created)));
        if (uniqueInData2.length > 0) {
          await Promise.all(uniqueInData2.map((v: any) => {
            this.create(v).then((item: any) => {
              item.Dulieu = JSON.stringify(item)
              this.GetVttechKhachhang(item)})
          }));
          const result = `Code 201:  Cập Nhật Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b> Với Số Lượng: <b><u>${uniqueInData2.length}</u></b>`;
          this._TelegramService.SendLogdev(result);
          return { status: 201 };
        }
        else
        {
          const result = `Code 200: Cập Nhật Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b> Với Số Lượng: <b><u>0</u></b>`;
          this._TelegramService.SendLogdev(result);
          return { status: 200 };
        }
      }
      else 
      {
        const result = "Code 403: Lỗi Xác thực"
        this._TelegramService.SendLogdev(result);
        return { status: 404,title:'Lỗi Data Trả Về' };
      }
    } catch (error) {
      const result = `Lỗi Xác Thực Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b>`;
      this._TelegramService.SendLogdev(result);
      return { status: 400,title:'Lỗi Xác Thực',Cookie: this.Cookie, 'Xsrf-Token': this.XsrfToken };
    }
  }
  async GetVttechKhachhang(item:any) {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://tmtaza.vttechsolution.com/Searching/Searching/?handler=SearchByOption&data=[{"name":"CUST_CODE","value":"'+item.CustCode+'"}]',
      headers: { Cookie: this.Cookie, 'Xsrf-Token': this.XsrfToken },
    };
    try {
      const response = await axios.request(config);
      const Hoadon = await this.GetHoadon(response.data.Table[0].CustomerID)
      const Hoadon_id = Hoadon.Table.find((v:any)=>
      {
        const Date1 = new Date(v.Created)
        const Date2 = new Date(item.Created)
        return Date1.getTime() == Date2.getTime()
      })
      const item1 = {...item,time:moment(new Date(item.Created)).add(1, 'hours'),SDT:response.data.Table[0].CustomerPhone,InvoiceNum:Hoadon_id?.InvoiceNum } 
      const Updatedata = 
      { 
        ZNS: {Dukien:this.SetRuleTimeZns(item1.time),Thucte:null,Status:0},
        TimeZNS: this.SetRuleTimeZns(item1.time),
        id: item1.id,
        Dulieu: item1.Dulieu,
        SDT: item1.SDT,
        InvoiceNum: item1.InvoiceNum
      }
      this.update(Updatedata.id,Updatedata)
    } catch (error) {
      console.error(error);
    }
  }
  SetRuleTimeZns(time:any)
  {
    const targetDate = moment(time);
    const current = new Date(time)
    const now = new Date();
    const Homnay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);
    const Ngaymai = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0, 0);
    const CronNgaymai = moment(Ngaymai);
    if (current.getTime() <= Homnay.getTime()) {
      return targetDate 
    }
    else {
      return CronNgaymai
    }
  }
  async GetHoadon(CustomerID:any) {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://tmtaza.vttechsolution.com/Customer/Payment/PaymentList/PaymentList_Service/?handler=LoadataPayment&CustomerID=${CustomerID}&CurrentID=0&CurrentType=`,
      headers: { Cookie: this.Cookie, 'Xsrf-Token': this.XsrfToken },
    };
    
   return axios.request(config)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.log(error);
    });
    
  }

  Getdatetime(data: any) {
    const date1 = new Date(data);
    return date1.getTime()
  }
  async create(CreateVttechthanhtoanDto: CreateVttechthanhtoanDto) {
    this.VttechthanhtoanRepository.create(CreateVttechthanhtoanDto);
    return await this.VttechthanhtoanRepository.save(CreateVttechthanhtoanDto);
  }

  async findAll() {
    return await this.VttechthanhtoanRepository.find();
  }
  async Checkthanhtoan() {
    const now = new Date()
    // return await this.VttechthanhtoanRepository.findOne({
    //   where: { id: id },
    // });
  }
  async findbetween(start: any,end:any) {
    const startTime = new Date(start)
    const endTime = new Date(end)
    return await this.VttechthanhtoanRepository.find({
      where: {
        TimeZNS: Between(startTime, endTime),
        Status:0
      },
    });
  }
  async findid(id: string) {
    return await this.VttechthanhtoanRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(slug: any) {
    return await this.VttechthanhtoanRepository.findOne({
      where: { CustName: slug },
    });
  }
  async findPagination(page: number, perPage: number) {
    const skip = (Number(page) - 1) * Number(perPage);
    const totalItems = await this.VttechthanhtoanRepository.count();
    const vttechthanhtoans = await this.VttechthanhtoanRepository.find({ skip: skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: vttechthanhtoans,
    };
  }
  async findQuery(query: string) {
    return await this.VttechthanhtoanRepository.find({
      where: { CustName: Like(`%query%`) },
    });
  }
  async update(id: string, UpdateVttechthanhtoanDto: any) {
    this.VttechthanhtoanRepository.save(UpdateVttechthanhtoanDto);
    return await this.VttechthanhtoanRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    await this.VttechthanhtoanRepository.delete(id);
    return { deleted: true };
  }
  // async SendTelegram(data: string): Promise<any> {
  //   console.error(data);
  //   const options = {
  //     url: `https://api.telegram.org/bot${environment.APITelegram_accesstoken}/sendMessage?chat_id=${environment.APITelegram_Logdev}&text=${data}&parse_mode=html`,
  //   };
  //   const response = await axios.post(options.url);
  //   return response.data;
  // }
}
