import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Like, Repository } from 'typeorm';
import { CreateVttechthanhtoanDto } from './dto/create-vttechthanhtoan.dto';
import { VttechthanhtoanEntity } from './entities/vttechthanhtoan.entity';
import axios from 'axios';
import { CauhinhchungService } from '../../cauhinh/cauhinhchung/cauhinhchung.service';
import * as moment from 'moment';
import { TelegramService } from '../../shared/telegram.service';
import { LIST_CHI_NHANH } from '../../shared.utils';
import { ZaloznsService } from '../../zalo/zalozns/zalozns.service';
import { VttechthanhtoanZNSEntity } from './entities/vttechthanhtoan-zns.entity';
import { LoggerService } from '../../logger/logger.service';
import * as getDeepValue from 'typeorm';
@Injectable()
export class VttechthanhtoanService {
  Cookie: any = ''
  XsrfToken: any = ''
  constructor(
    @InjectRepository(VttechthanhtoanEntity)
    private VttechthanhtoanRepository: Repository<VttechthanhtoanEntity>,
    @InjectRepository(VttechthanhtoanZNSEntity)
    private VttechthanhtoanZNSRepository: Repository<VttechthanhtoanZNSEntity>,
    private _CauhinhchungService: CauhinhchungService,
    private _TelegramService: TelegramService,
    private _ZaloznsService: ZaloznsService,
    private _LoggerService: LoggerService,
  ) {
    this._CauhinhchungService.findslug('vttechtoken').then((data: any) => {
      this.Cookie = data.Content.Cookie
      this.XsrfToken = data.Content.XsrfToken
    })
  }
  async getApiRealtime() {    
    const begin = moment().format("DD-MM-YYYY")
    const end = moment().format("DD-MM-YYYY")
    // const begin = moment(new Date(data.begin)).format("DD-MM-YYYY")
    // const end = moment(new Date(data.end)).format("DD-MM-YYYY")
    console.log(begin,end);
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://tmtaza.vttechsolution.com/Report/Revenue/Branch/AllBranchGrid/?handler=LoadataDetailByBranch&branchID=0&dateFrom=${begin}&dateTo=${end}`,
      headers: { Cookie: this.Cookie, 'Xsrf-Token': this.XsrfToken },
    };
    try {
      const response = await axios.request(config);
      if (Array.isArray(response.data)) {
        const data1 = response.data;
        const data2 = await this.findBydate(moment(new Date()).startOf('day').toDate(),moment(new Date()).endOf('day').toDate());        
        const uniqueInData2 =  data1.filter((item:any) => !data2.some((data1Item:any) => moment(data1Item.Dulieu.Created).isSame(moment(item.Created))));
        if (uniqueInData2.length > 0) {
          await Promise.all(uniqueInData2.map((v: any) => {
            v.Dulieu = JSON.stringify(v)
            this.create(v).then((item: any) => {
              this.GetKHByCode(item)
            })
          }));
          // const result = `Thanh Toán Code 201:  Cập Nhật Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b> Với Số Lượng: <b><u>${uniqueInData2.length}</u></b>`;
          // this._TelegramService.SendLogdev(result);
          const logger ={Title:'Thanhtoanvttech',Mota:`Thanh Toán Code 201:  Cập Nhật Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b> Với Số Lượng: <b><u>${uniqueInData2.length}</u></b>`}
          this._LoggerService.create(logger)
          return { status: 201 };
        }
        else {
          // const result = `Thanh Toán Code 200: Cập Nhật Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b> Với Số Lượng: <b><u>0</u></b>`;
          // this._TelegramService.SendLogdev(result);
          const logger ={Title:'Thanhtoanvttech',Mota:`Thanh Toán Code 200: Cập Nhật Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b> Với Số Lượng: <b><u>0</u></b>`}
          this._LoggerService.create(logger)
          return { status: 200 };
        }
      }
      else {
        // const result = "Code 403: Lỗi Xác thực"
        // this._TelegramService.SendLogdev(result);
        const logger ={Title:'Thanhtoanvttech',Mota:`Code 403: Lỗi Xác thực`}
        this._LoggerService.create(logger)
        return { status: 404, title: 'Lỗi Data Trả Về' };
      }
    } catch (error) {
      // const result = `Lỗi Xác Thực Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b>`;
      // this._TelegramService.SendLogdev(result);
      const logger ={Title:'Thanhtoanvttech',Mota:`Lỗi Xác Thực Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b>`}
      this._LoggerService.create(logger)
      return { status: 400, title: 'Lỗi Xác Thực', Cookie: this.Cookie, 'Xsrf-Token': this.XsrfToken };
    }
  }

  async GetKHByCode(item: any) {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://tmtaza.vttechsolution.com/Searching/Searching/?handler=SearchByOption&data=[{"name":"CUST_CODE","value":"' + item.CustCode + '"}]',
      headers: { Cookie: this.Cookie, 'Xsrf-Token': this.XsrfToken },
    };
    try {
      const response = await axios.request(config);
      const Hoadon = await this.GetHoadon(response.data.Table[0].CustomerID)
      const Hoadon_id = Hoadon.Table.find((v: any) => {
        const Date1 = new Date(v.Created)
        const Date2 = new Date(item.Created)
        return Date1.getTime() == Date2.getTime()
      })
        const Updatedata =
          {
            ...item,
            DukienZNS: new Date(),
            StatusZNS: 0,
            TimeZNS: new Date(),
            SDT: response.data.Table[0].CustomerPhone,
            InvoiceNum: Hoadon_id?.InvoiceNum,
          }
          this.update(Updatedata.id, Updatedata)   
    } catch (error) {
      console.error(error);
    }
  }


  async GetVttechKhachhang() {
    if(this.CheckTime())
    {
    const begin = moment(new Date()).startOf('day').toDate()
    const end = moment(new Date()).endOf('day').toDate()
    const ListKH = await this.findNew(begin,end)
    const Group = ListKH.filter((obj, i) => ListKH.findIndex(o => o.InvoiceNum === obj.InvoiceNum) === i).map(obj => ({
      CustName: obj.CustName,
      BranchID: obj.BranchID,
      Gender: obj.Gender,
      SDT: obj.SDT,
      TimeZNS: obj.TimeZNS,
      InvoiceNum: obj.InvoiceNum,
      Created: obj.Created,
      Amount: Number(ListKH.filter(o => o.InvoiceNum === obj.InvoiceNum).reduce((total, o) => Number(total) + Number(o.Amount), 0)),
    }));      
    Group.forEach((v:any,k:any) => {
      setTimeout(async () => {
       const result = await this.createzns(v)
       if(this.CheckTime())
       {
        this.sendZNSThanhtoan(result)
       }
      },Math.random()*1000+ k*1000);
    });
    console.error(ListKH);
    return {count:Group.length,data:Group}
  }
 }
 async sendZNSThanhtoan(data: any) {    
    const Chinhanh = LIST_CHI_NHANH.find((v: any) => Number(v.idVttech) == Number(data.BranchID))
    if (Chinhanh) {
      try {        
        this._ZaloznsService.sendtestzns(data, Chinhanh).then((zns: any) => {
          if (zns) {
            if (zns.status == 'sms') {
              data.SMS = zns.data
              data.Status = 4
              this.updatezns(data.id, data)
              this.UpdateThanhtoan(data.InvoiceNum,4)
              const result = `<b><u>${zns.Title}</u></b>`;
              this._TelegramService.SendNoti(result)
            }
            else {
              data.ThucteZNS = new Date()
              data.StatusZNS = 2
              data.Status = 2
              this.updatezns(data.id, data)
              this.UpdateThanhtoan(data.InvoiceNum,2)
              const result = `<b><u>${zns.Title}</u></b>`;
              this._TelegramService.SendNoti(result)
            }
          }
        })
      } catch (error) {
        console.error(`Error calling Zalozns service: ${error.message}`);
      }
      data.Status = 1
      this.UpdateThanhtoan(data.InvoiceNum,1)
      this.updatezns(data.id, data)
      const result = `Thanh Toán : ${data.InvoiceNum} - ${data.CustName} - ${data.SDT} - ${moment(new Date()).format("HH:mm:ss DD/MM/YYYY")}`;
      this._TelegramService.SendNoti(result)
    }
    else {
      data.Status = 3
      this.updatezns(data.id, data)
      this.UpdateThanhtoan(data.InvoiceNum,3)
      const result = `Chi nhánh chưa đăng ký ZNS`;
      this._TelegramService.SendLogdev(result)
    }
  }
  async UpdateThanhtoan(InvoiceNum:any,Status:any)
  {
    const Invoices = await this.findInvoiceNum(InvoiceNum)
    console.log(Invoices);
    
    Invoices.forEach((v:any) => {
      v.Status = Status
      this.update(v.id,v)
    });
  }

  SetRuleTimeZns(time: any) {
    const targetDate = moment(time);
    const current = new Date(time)
    const now = new Date();
    const Homnay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0, 0);
    const Ngaymai = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0, 0);
    const CronNgaymai = moment(Ngaymai);
    if (current.getTime() <= Homnay.getTime()) {
      return true
    }
    else {
      return false
    }
  }

  async GetHoadon(CustomerID: any) {
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
    return new Date(data);
  }
  async create(CreateVttechthanhtoanDto: CreateVttechthanhtoanDto) {
    this.VttechthanhtoanRepository.create(CreateVttechthanhtoanDto);
    return await this.VttechthanhtoanRepository.save(CreateVttechthanhtoanDto);
  }

  async findAll() {
    const result = await this.VttechthanhtoanRepository.find();
    result.forEach((v)=>
    {

    })
    return result
  }
  async findbetween(start: any, end: any) {
    const startTime = new Date(start)
    const endTime = new Date(end)
    return await this.VttechthanhtoanRepository.find({
      where: {
        CreateAt: Between(startTime, endTime),
        Status: In([0, 1]),
      },
    });
  }
  async findNew(start: any, end: any) {
    return await this.VttechthanhtoanRepository.find({
      where: {
        CreateAt: Between(start, end),
        Status: In([0]),
      },
    });
  }
  async findBydate(start: any, end: any) {
    return await this.VttechthanhtoanRepository.find({
      where: {
        CreateAt: Between(start, end),
      },
    });
  }
  async findid(id: string) {
    return await this.VttechthanhtoanRepository.findOne({
      where: { id: id },

    });
  }
  async findInvoiceNum(InvoiceNum: string) {
    return await this.VttechthanhtoanRepository.find({
      where: { InvoiceNum: InvoiceNum },
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
  async findQuery(params: any) {
    console.error(params);
    const queryBuilder = this.VttechthanhtoanRepository.createQueryBuilder('vttechthanhtoan');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('vttechthanhtoan.CreateAt BETWEEN :startDate AND :endDate', {
        startDate: params.Batdau,
        endDate: params.Ketthuc,
      });
    }
    if (params.SDT) {
      queryBuilder.andWhere('vttechthanhtoan.SDT LIKE :SDT', { SDT: `%${params.SDT}%` });
    }
    if (params.Status) {
      queryBuilder.andWhere('vttechthanhtoan.Status LIKE :Status', { Status: `${params.Status}` });
    }
    const [items, totalCount] = await queryBuilder
      .limit(params.pageSize || 10)
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();

    const queryBuilder1 = this.VttechthanhtoanRepository.createQueryBuilder('vttechthanhtoan');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder1.andWhere('vttechthanhtoan.CreateAt BETWEEN :startDate AND :endDate', {
        startDate: params.Batdau,
        endDate: params.Ketthuc,
      });
    }
    const [result] = await queryBuilder1.getManyAndCount();
    const ListStatus = result.map((v: any) => ({ Status: v.Status }))

    return { items, totalCount, ListStatus };
  }
  async findQueryZNS(params: any) {
    console.error(params);
    const queryBuilder = this.VttechthanhtoanZNSRepository.createQueryBuilder('vttechthanhtoan_zns');
    const queryBuilder1 = this.VttechthanhtoanZNSRepository.createQueryBuilder('vttechthanhtoan_zns');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('vttechthanhtoan_zns.Created BETWEEN :startDate AND :endDate', {
        startDate: params.Batdau,
        endDate: params.Ketthuc,
      }); 
     queryBuilder1.andWhere('vttechthanhtoan_zns.Created BETWEEN :startDate AND :endDate', {
        startDate: params.Batdau,
        endDate: params.Ketthuc,
      });
    }
    if (params.hasOwnProperty("Status")) {
      queryBuilder.andWhere('vttechthanhtoan_zns.Status LIKE :Status', { Status: `${params.Status}` });
    }
    if (params.hasOwnProperty("BranchID")&&params.BranchID!=0) {
      queryBuilder.andWhere('vttechthanhtoan_zns.BranchID = :BranchID', { BranchID: `${params.BranchID}` });
      queryBuilder1.andWhere('vttechthanhtoan_zns.BranchID = :BranchID', { BranchID: `${params.BranchID}` });
    }
    const [items, totalCount] = await queryBuilder
      .limit(params.pageSize || 10)
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();


    const [result] = await queryBuilder1.getManyAndCount();
    const ListStatus = result.map((v: any) => ({ Status: v.Status }))

    return { items, totalCount, ListStatus };
  }

  async update(id: string, data: any) {
    this.VttechthanhtoanRepository.save(data);
    return await this.VttechthanhtoanRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    await this.VttechthanhtoanRepository.delete(id);
    return { deleted: true };
  }
  async createzns(data: any) {
    this.VttechthanhtoanZNSRepository.create(data);
    return await this.VttechthanhtoanZNSRepository.save(data);
  }
  async updatezns(id: string, data: any) {
    this.VttechthanhtoanZNSRepository.save(data);
    return await this.VttechthanhtoanZNSRepository.findOne({ where: { id: id } });
  }
  CheckTime() {
    const now = moment();
    const checkTime = now.hour() >= 8 && now.hour() <= 19;
    return checkTime
  }
}
