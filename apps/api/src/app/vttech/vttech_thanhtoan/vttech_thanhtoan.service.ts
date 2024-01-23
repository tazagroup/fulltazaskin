import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Like, Repository } from 'typeorm';
import { CreateVttech_thanhtoanDto } from './dto/create-vttech_thanhtoan.dto';
import { Vttech_thanhtoanEntity } from './entities/vttech_thanhtoan.entity';
import axios from 'axios';
import { CauhinhchungService } from '../../cauhinh/cauhinhchung/cauhinhchung.service';
import * as moment from 'moment';
import { TelegramService } from '../../shared/telegram.service';
import { LIST_CHI_NHANH } from '../../shared.utils';
import { ZaloznsService } from '../../zalo/zalozns/zalozns.service';
import { LoggerService } from '../../logger/logger.service';
@Injectable()
export class Vttech_thanhtoanService {
  Cookie: any = ''
  XsrfToken: any = ''
  constructor(
    @InjectRepository(Vttech_thanhtoanEntity)
    private Vttech_thanhtoanRepository: Repository<Vttech_thanhtoanEntity>,
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
  async getApiRealtime(idVttech: any, data: any = {}) {
    let begin: any
    let end: any
    if (Object.entries(data).length > 0) {
      begin = moment(new Date(data.begin)).format('DD-MM-YYYY')
      end = moment(new Date(data.end)).format('DD-MM-YYYY')
    }
    else {
      begin = moment().format('DD-MM-YYYY')
      end = moment().format('DD-MM-YYYY')
    }
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://tmtaza.vttechsolution.com/Report/Revenue/Branch/AllBranchGrid/?handler=LoadataDetailByBranch&branchID=${idVttech}&dateFrom=${begin}&dateTo=${end}`,
      headers: { Cookie: this.Cookie, 'Xsrf-Token': this.XsrfToken },
    };
    try {
      const response = await axios.request(config);
      if (Array.isArray(response.data)) {
        response.data.forEach(async (v: any) => {
          let item: any = {}
          item = v
          item.checkTime = (new Date(v.Created)).getTime()
          item.Dulieu = JSON.stringify(v)
          const result = await this.create(v)
          this.GetKHByCode(result)
        });
        const logger = { Title: 'Thanhtoanvttech', Mota: `Lấy ${response.data.length} Thanh Toán Từ Vttech` }
        this._LoggerService.create(logger)
        return { status: 201, title: `Lấy ${response.data.length} Thanh Toán Từ Vttech` };
      }
      else {
        const logger = { Title: 'Thanhtoanvttech', Mota: `Code 403: Lỗi Xác thực` }
        this._LoggerService.create(logger)
        return { status: 404, title: 'Lỗi Data Trả Về' };
      }
    } catch (error) {
      const logger = { Title: 'Thanhtoanvttech', Mota: `Lỗi Xác Thực Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b>` }
      this._LoggerService.create(logger)
      return { status: 400, title: 'Lỗi Xác Thực', Cookie: this.Cookie, 'Xsrf-Token': this.XsrfToken };
    }
  }
  async SendXNTTauto() {
    const ListThanhtoan = await this.fininday()
    ListThanhtoan.forEach((v)=>
    {
      if(this.CheckTime()&&v.SDT=='0977272967')
      {
        this.sendZNSThanhtoan(v)
      }
    })
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
      const Hoadon = await this.GetHoadon(response.data.Table[0]?.CustomerID)
      const Hoadon_id = Hoadon?.Table?.find((v: any) => {
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


  async GetVttechKhachhang() {}
  async sendZNSThanhtoan(data: any) {
    const CheckData = await this.findid(data.id)
    if (CheckData.Status == 0 || CheckData.Status == 1) {
        const Chinhanh = LIST_CHI_NHANH.find((v: any) => Number(v.idVttech) == Number(data.BranchID))
        if (Chinhanh) {
          try {
            this._ZaloznsService.sendThanhtoanZns(data, Chinhanh).then((zns: any) => {
              if (zns) {
                if (zns.status == 'sms') {
                  data.SMS = zns.data
                  data.Status = 4
                  this.update(data.id,data)
                  const result = `<b><u>${zns.Title}</u></b>`;
                  this._TelegramService.SendNoti(result)
                }
                else {
                  data.ThucteZNS = new Date()
                  data.StatusZNS = 2
                  data.Status = 2
                  this.update(data.id,data)
                  const result = `<b><u>${zns.Title}</u></b>`;
                  this._TelegramService.SendNoti(result)
                }
              }
            })
          } catch (error) {
            console.error(`Error calling Zalozns service: ${error.message}`);
          }
          // data.Status = 1
          // this.UpdateThanhtoan(data.InvoiceNum, 1)
          // const result = `Thanh Toán : ${data.InvoiceNum} - ${data.CustName} - ${data.SDT} - ${moment(new Date()).format("HH:mm:ss DD/MM/YYYY")}`;
          // this._TelegramService.SendNoti(result)
        }
        else {
          data.Status = 3
          this.update(data.id,data)
          const result = `Chi nhánh chưa đăng ký ZNS`;
          this._TelegramService.SendLogdev(result)
        }
    }
  }
  async UpdateThanhtoan(InvoiceNum: any, Status: any) {
    const Invoices = await this.findInvoiceNum(InvoiceNum)
    console.log(Invoices);
    Invoices.forEach((v: any) => {
      v.Status = Status
      this.update(v.id, v)
    });
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
  async create(data: any) {
    console.log("Old", data);

    const result = await this.findiChecktime(data.checkTime)
    console.log("New", result);

    if (result) {
      return { error: 1001, data: "Trùng Dữ Liệu" }

    }
    else {
      this.Vttech_thanhtoanRepository.create(data);
      return await this.Vttech_thanhtoanRepository.save(data);
    }

  }

  async findAll() {
    const result = await this.Vttech_thanhtoanRepository.find();
    result.forEach((v) => {

    })
    return result
  }
  async findbetween(start: any, end: any) {
    const startTime = new Date(start)
    const endTime = new Date(end)
    return await this.Vttech_thanhtoanRepository.find({
      where: {
        CreateAt: Between(startTime, endTime),
        Status: In([0, 1]),
      },
    });
  }
  async fininday() {
    const Start = moment().startOf('date').toDate()
    const End = moment().endOf('date').toDate()
    return await this.Vttech_thanhtoanRepository.find({
      where: {
        CreateAt: Between(Start, End),
        Status: 0,
      },
    });
  }
  async findNew(start: any, end: any) {
    return await this.Vttech_thanhtoanRepository.find({
      where: {
        CreateAt: Between(start, end),
        Status: In([0]),
      },
    });
  }
  async findBydate(start: any, end: any) {
    return await this.Vttech_thanhtoanRepository.find({
      where: {
        CreateAt: Between(start, end),
      },
    });
  }
  async findid(id: string) {
    return await this.Vttech_thanhtoanRepository.findOne({
      where: { id: id },
    });
  }
  async findiChecktime(time: string) {
    return await this.Vttech_thanhtoanRepository.findOne({
      where: { checkTime: time },
    });
  }
  async findInvoiceNum(InvoiceNum: string) {
    return await this.Vttech_thanhtoanRepository.find({
      where: { InvoiceNum: InvoiceNum },
    });
  }
  async findslug(slug: any) {
    return await this.Vttech_thanhtoanRepository.findOne({
      where: { CustName: slug },
    });
  }
  async findQuery(params: any) {
    console.error(params);
    const queryBuilder = this.Vttech_thanhtoanRepository.createQueryBuilder('vttech_thanhtoan');
    const queryBuilder1 = this.Vttech_thanhtoanRepository.createQueryBuilder('vttech_thanhtoan');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('vttech_thanhtoan.CreateAt BETWEEN :startDate AND :endDate', {
        startDate: params.Batdau,
        endDate: params.Ketthuc,
      });
      queryBuilder1.andWhere('vttech_thanhtoan.CreateAt BETWEEN :startDate AND :endDate', {
        startDate: params.Batdau,
        endDate: params.Ketthuc,
      });
    }
    if (params.hasOwnProperty("SDT")) {
      queryBuilder.andWhere('vttech_thanhtoan.SDT LIKE :SDT', { SDT: `%${params.SDT}%` });
    }
    if (params.hasOwnProperty("Status")) {
      queryBuilder.andWhere('vttech_thanhtoan.Status LIKE :Status', { Status: `${params.Status}` });
    }
    if (params.hasOwnProperty("BranchID") && params.BranchID != 0) {
      queryBuilder.andWhere('vttech_thanhtoan.BranchID = :BranchID', { BranchID: `${params.BranchID}` });
      queryBuilder1.andWhere('vttech_thanhtoan.BranchID = :BranchID', { BranchID: `${params.BranchID}` });
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
    this.Vttech_thanhtoanRepository.save(data);
    return await this.Vttech_thanhtoanRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    await this.Vttech_thanhtoanRepository.delete(id);
    return { deleted: true };
  }
  CheckTime() {
    const now = moment();
    const checkTime = now.hour() >= 8 && now.hour() <= 19;
    return checkTime
  }
}
