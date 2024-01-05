import { Injectable } from '@nestjs/common';
import { CreateVttechDto } from './dto/create-vttech.dto';
import { UpdateVttechDto } from './dto/update-vttech.dto';
import axios from 'axios';
import { CauhinhchungService } from '../cauhinh/cauhinhchung/cauhinhchung.service';
import { TelegramService } from '../shared/telegram.service';
import { TasksService } from '../tasks/tasks.service';
import { Vttech_khachhangService } from './vttech_khachhang/vttech_khachhang.service';
import moment = require('moment');
import { Vttech_tinhtrangphongService } from './vttech_tinhtrangphong/vttech_tinhtrangphong.service';
import { Vttech_dieutriService } from './vttech_dieutri/vttech_dieutri.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { LIST_CHI_NHANH } from '../shared.utils';
import { ZaloznsService } from '../zalo/zalozns/zalozns.service';
import { CronJob } from '@nestjs/schedule/node_modules/cron/dist/job';
@Injectable()
export class VttechService {
  Cookie: any = ''
  XsrfToken: any = ''
  constructor(
    private _CauhinhchungService: CauhinhchungService,
    private _TelegramService: TelegramService,
    private _Vttech_khachhangService: Vttech_khachhangService,
    private _Vttech_tinhtrangphongService: Vttech_tinhtrangphongService,
    private _Vttech_dieutriService: Vttech_dieutriService,
    private schedulerRegistry: SchedulerRegistry,
    private _ZaloznsService: ZaloznsService,
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

  async getTinhtrangphong() {
    const now = new Date()
    const formattedBegin = moment(new Date(now)).format("DD-MM-YYYY");
    const formattedEnd = moment(new Date(now)).format("DD-MM-YYYY");

    LIST_CHI_NHANH.forEach(async (v)=>{
      try {
        const response = await axios.request(
          {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://tmtaza.vttechsolution.com/Report/Manu/ManuStatusGen/?handler=LoadataDetail&branchID=${v.idVttech}&roomID=0&dateFrom=${formattedBegin}&dateTo=${formattedEnd}`,
            headers: {
              Cookie: this.Cookie,
              'Xsrf-Token': this.XsrfToken,
            },
          });
        if (Array.isArray(response.data)) {          
          const data1 = response.data;
          const data2 = await this._Vttech_tinhtrangphongService.findAll();
          const uniqueInData2 = data1.filter((item: { BeginTime: any; }) => !data2.some((data1Item: any) => this.Getdatetime(data1Item.Dulieu.BeginTime) === this.Getdatetime(item.BeginTime)));
          if (uniqueInData2.length > 0) {
            await Promise.all(uniqueInData2.map((v: any) => {
              const item: any = {}
              item.CustCode = v.CustCode
              item.CustName = v.CustName
              item.CustID = v.CustID
              item.BeginTime = v.BeginTime
              item.Dulieu = v
              this._Vttech_tinhtrangphongService.create(item)
            }));
            const result = `Trạng Thái Phòng Code 201:  Cập Nhật Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b> Với Số Lượng: <b><u>${uniqueInData2.length}</u></b>`;
            this._TelegramService.SendLogdev(result);
            return { status: 201, count: uniqueInData2.length, result: uniqueInData2 };
          }
          else {
            const result = `Trạng Thái Phòng Code 200: Cập Nhật Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b> Với Số Lượng: <b><u>0</u></b>`;
            this._TelegramService.SendLogdev(result);
            return { status: 200 };
          }
        }
        else {
          const result = "Trạng Thái Phòng Code 403: Lỗi Xác thực"
          this._TelegramService.SendLogdev(result);
          return { status: 404, title: 'Lỗi Data Trả Về' };
        }
      } catch (error) {
        const result = `Trạng Thái Phòng Lỗi Xác Thực Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b>`;
        this._TelegramService.SendLogdev(result);
        return { status: 400, title: 'Trạng Thái Phòng Lỗi Xác Thực', Cookie: this.Cookie, 'Xsrf-Token': this.XsrfToken };
      }

    })
  }
  async getDieutri(data: any) {
    const now = new Date()
    const Start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const End = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    try {
      const response = await axios.request(
        {
          method: 'post',
          maxBodyLength: Infinity,
          url: `https://tmtaza.vttechsolution.com/Customer/Treatment/TreatmentList/TreatmentList_Service/?handler=LoadataTreatment&CustomerID=${data.CustID}&PatientRecordID=0&TreatmentPlanID=0&ServiceTabID=0&idbegin=0&idbeginless=0&limit=50`,
          headers: {
            Cookie: this.Cookie,
            'Xsrf-Token': this.XsrfToken,
          },
        });
      if (Array.isArray(response.data.Table)) {
        const data1 = await response.data.Table.filter((v:any)=>this.Getdatetime(v.Created)>this.Getdatetime(Start)&& this.Getdatetime(v.Created)<this.Getdatetime(End));
        const data2 = await this._Vttech_dieutriService.findAll();
        const uniqueInData2 = data1.filter((item: any) => !data2.some((data1Item: any) => this.Getdatetime(data1Item.Dulieu.Created) === this.Getdatetime(item.Created)));        
        if (uniqueInData2.length > 0) {
          await Promise.all(uniqueInData2.map(async (v: any) => {
            const config = {
              method: 'post',
              maxBodyLength: Infinity,
              url: 'https://tmtaza.vttechsolution.com/Searching/Searching/?handler=SearchByOption&data=[{"name":"CUST_CODE","value":"' + data.CustCode + '"}]',
              headers: { Cookie: this.Cookie, 'Xsrf-Token': this.XsrfToken },
            };
            try {
              const response1 = await axios.request(config);              
              if (response1.data.Table[0]) {
                const item: any = {}
                item.SDT = response1.data.Table[0].CustomerPhone
                item.CustID = data.CustID
                item.ServiceName = v.ServiceName
                item.Created = v.Created
                item.BranchCode = v.BranchCode
                item.BranchName = v.BranchName
                item.CustCode = data.CustCode
                item.CustName = data.CustName
                item.Dulieu = v
                item.TimeZNS = moment(v.Created).add(3,"hours").toDate()
                this._Vttech_dieutriService.create(item)
              }
            } catch (error) {
              console.error(error);
            }
          }));

          // const result = `Điều trị Code 201:  Cập Nhật Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b> Với Số Lượng: <b><u>${uniqueInData2.length}</u></b>`;
          // this._TelegramService.SendLogdev(result);
           return { status: 201, count: uniqueInData2.length, result: uniqueInData2 };
        }
        else {
         // const result = `Điều trị Code 200: Cập Nhật Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b> Với Số Lượng: <b><u>0</u></b>`;
         // this._TelegramService.SendLogdev(result);
          return { status: 200 };
        }
      }
      else {
        const result = "Điều trị Code 403: Lỗi Xác thực"
        this._TelegramService.SendLogdev(result);
        return { status: 404, title: 'Lỗi Data Trả Về' };
      }
    } catch (error) {
      const result = `Điều trị Lỗi Xác Thực Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b>`;
      this._TelegramService.SendLogdev(result);
      return { status: 400, title: 'Điều trị Lỗi Xác Thực', Cookie: this.Cookie, 'Xsrf-Token': this.XsrfToken };
    }
  }
  async CreateDieutri() {
    await this.getTinhtrangphong();
    const Tinhtrangphongs = await this._Vttech_tinhtrangphongService.fininday();
    setTimeout(async () => {
      Tinhtrangphongs.forEach((v: any) => {
        this.getDieutri(v);
      });
    }, 5000);
    return Tinhtrangphongs
  }
  async ZnsDieutri() {
    const now = new Date()
    const End = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0, 0);
    const Tinhtrangphongs = await this._Vttech_dieutriService.fininday();
    setTimeout(async () => {      
      Tinhtrangphongs.forEach((v: any) => {
        if(this.Getdatetime(v.TimeZNS)<=this.Getdatetime(End))
        {
          this.addCron(v)
        }
      });
    }, 5000);
    return Tinhtrangphongs
  }
  async SendZnsDieutri(data:any) {
    this.addCron(data)
  }
  addCron(data: any) {
    console.error('Cron data : ',data);
    let cronExpression: any;
    const targetDate = moment(data.TimeZNS);
    cronExpression = `0 ${targetDate.minute()} ${targetDate.hour()} ${targetDate.date()} ${targetDate.month() + 1} ${targetDate.isoWeekday()}`;
    console.error(cronExpression);  
    const Chinhanh = LIST_CHI_NHANH.find((v: any) => v.BranchCode == data.BranchCode)    
    if (Chinhanh) {
      const job = new CronJob(cronExpression, () => {
        const result = `Điều Trị : ${data.id} sẽ được gửi lúc ${targetDate.format("HH:mm:ss DD/MM/YYYY")}`;
        this._TelegramService.SendLogdev(result)
        try {
          this._ZaloznsService.TemplateDanhgia(data, Chinhanh).then((zns: any) => {
            if (zns) {
              // if (zns.status == 'sms') {
              //   data.SMS = zns.data
              //   data.Status = 4
              //   this._Vttech_dieutriService.update(data.id, data)
              //   // const result = `<b><u>${zns.Title}</u></b>`;
              //   // this._TelegramService.SendNoti(result)
              // }
              // else {
                data.SendZNSAt = new Date()
                data.StatusZNS = 2
                data.Status = 2
                this._Vttech_dieutriService.update(data.id, data)
                // const result = `<b><u>${zns.Title}</u></b>`;
                // this._TelegramService.SendNoti(result)
              // }
            }
          })
        } catch (error) {
          console.error(`Error calling Zalozns service: ${error.message}`);
        }
      })
      this.schedulerRegistry.addCronJob(data.id, job);
      job.start();
      data.Status = 1
      this._Vttech_dieutriService.update(data.id, data)
      const result = `Điều Trị: ${data.CustName} - ${data.SDT} ${data.ServiceName} - ${targetDate.format("HH:mm:ss DD/MM/YYYY")}`;
      this._TelegramService.SendNoti(result)
    }
    else {
      data.Status = 3
      this._Vttech_dieutriService.update(data.id, data)
      const result = `Chi nhánh chưa đăng ký ZNS`;
      this._TelegramService.SendLogdev(result)
    }
    return data
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
