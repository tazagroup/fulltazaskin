import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Like, Repository } from 'typeorm';
import { CreateVttech_thanhtoanDto } from './dto/create-vttech_thanhtoan.dto';
import { Vttech_thanhtoanEntity } from './entities/vttech_thanhtoan.entity';
import axios from 'axios';
import { CauhinhchungService } from '../../cauhinh/cauhinhchung/cauhinhchung.service';
import * as moment from 'moment';
import { LIST_CHI_NHANH } from '../../shared.utils';
import { ZaloznsService } from '../../zalo/zalozns/zalozns.service';
import { LoggerService } from '../../logger/logger.service';
import { TelegramService } from '../../shared/telegram.service';
@Injectable()
export class Vttech_thanhtoanService {
  Cookie: any = ''
  XsrfToken: any = ''
  constructor(
    @InjectRepository(Vttech_thanhtoanEntity)
    private Vttech_thanhtoanRepository: Repository<Vttech_thanhtoanEntity>,
    private _CauhinhchungService: CauhinhchungService,
    private _ZaloznsService: ZaloznsService,
    private _LoggerService: LoggerService,
    private _TelegramService: TelegramService,
  ) {
    this._CauhinhchungService.findslug('vttechtoken').then((data: any) => {
      this.Cookie = data.Content.Cookie
      this.XsrfToken = data.Content.XsrfToken
    })
  }
  async getApiRealtime(idVttech: any, data: any = {}) {
    const result = `Lấy Thanh Toán lúc ${moment()}`;
    this._TelegramService.SendLogdev(result) 
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
      console.log(response.data);
      if (Array.isArray(response.data)) {
        console.log(response.data);
        response.data.forEach(async (v: any) => {
          let item: any = {}
          item = v
          item.checkTime = (new Date(v.Created)).getTime()
          item.Dulieu = JSON.stringify(v)
          const result = await this.GetKHByCode(item)
          const checkInvoiceNum = await this.findInvoiceNum(result.InvoiceNum,item.checkTime)  
          // if(checkInvoiceNum && checkInvoiceNum.SDT=='0977272967')  
          // {
          //   console.log(checkInvoiceNum);
          // }
          if (checkInvoiceNum) {    
            console.log("Trùng Hoá Đơn");
            const logger = { Title: 'Thanh Toán Từ Vttech', Mota: `Trùng Hoá Đơn ${result.InvoiceNum} - ${result.SDT}` }
            this._LoggerService.create(logger)
            return { status: 1001, title: `Trùng Hoá Đơn ${result.InvoiceNum}` };
          }
          else {
            console.log("Tạo mới");
            console.log(checkInvoiceNum);
            this.create(result)
            const logger = { Title: 'Thanh Toán Từ Vttech', Mota: `Lấy ${response.data.length} Thanh Toán Từ Vttech` }
            this._LoggerService.create(logger)
            return { status: 201, title: `Lấy ${response.data.length} Thanh Toán Từ Vttech` };
          }
        });
        return response.data
      }
      else {
        const logger = { Title: 'Thanh Toán Từ Vttech', Mota: `Lỗi Data Trả Về ${JSON.stringify(response)}` }
        this._LoggerService.create(logger)
        return { status: 404, title: 'Lỗi Data Trả Về' };
      }
    } catch (error) {
      const logger = { Title: 'Thanh Toán Từ Vttech', Mota: `Lỗi Xác Thực Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b>` }
      this._LoggerService.create(logger)
      return { status: 400, title: 'Lỗi Xác Thực', Cookie: this.Cookie, 'Xsrf-Token': this.XsrfToken };
    }
  }
  async SendXNTTauto() {
    const result = `Gửi Thanh Toán lúc ${moment()}`;
    this._TelegramService.SendLogdev(result) 
    const ListThanhtoan = await this.fininday()
    ListThanhtoan.forEach((v: any) => {
      if(v.SDT!='0977272967')
      {
        if (this.CheckTime()) {
          this.sendZNSThanhtoan(v)
        }
      }
      else {
        v.Status = 7
        this.update(v.id, v)
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
      
      const Bill = Hoadon?.Table?.find((v: any) => {
        const Date1 = new Date(v.Created)
        const Date2 = new Date(item.Created)
        return Date1.getTime() == Date2.getTime()
      })
      const BillChitiet = Hoadon?.Table1?.filter((v: any) => {return v.id == Bill.id})

      const Updatedata =
      {
        ...item,
        DukienZNS: new Date(),
        SDT: response?.data?.Table[0]?.CustomerPhone,
        InvoiceNum: Bill?.InvoiceNum,
        Bill:Bill,
        BillChitiet:BillChitiet
      }
      return Updatedata
      //this.update(Updatedata.id, Updatedata)
    } catch (error) {
      console.error(error);
    }
  }

  async sendZNSThanhtoan(data: any) {
      const CheckData = await this.findid(data.id)
   //   if (CheckData.Status == 0 && data.SDT=='0977272967') {
       if (CheckData.Status == 0) {
        const Chinhanh = LIST_CHI_NHANH.find((v: any) => Number(v.idVttech) == Number(data.BranchID))
        console.log(Chinhanh);
        if (Chinhanh) {
          try {
          //  const SendNZS = await this._ZaloznsService.sendThanhtoanTaza(data, Chinhanh)
            let SendZNS:any={}
            const TAZA_BRANCH_IDS = [1, 2, 3, 4, 6, 7];
            const TIMONA_BRANCH_IDS = [7,14, 15, 16, 17, 18, 21];  
            const isTazaBranch = TAZA_BRANCH_IDS.includes(Number(Chinhanh.idVttech));
            const isTimonaBranch = TIMONA_BRANCH_IDS.includes(Number(Chinhanh.idVttech));    
            if (isTazaBranch) {
              SendZNS = await this._ZaloznsService.sendThanhtoanTaza(data, Chinhanh);
              console.log("Send Taza");
              
            } else if (isTimonaBranch) {
              SendZNS = await this._ZaloznsService.sendThanhtoanTimona(data, Chinhanh);
              console.log("Send Timona");
            }  
            switch (SendZNS.status) {
              case 'sms':
                {
                  data.SMS = SendZNS.data
                  data.ThucteZNS = new Date()
                  data.Status = 4
                  this.update(data.id, data)
                  const logger = {
                    Title: 'Thanh Toán',
                    Slug: 'thanhtoan',
                    Action: 'sms',
                    Mota: `${SendZNS.Title} -  SDT: ${data.SDT}`
                  }
                  this._LoggerService.create(logger)
                }
                break;
              case 'zns':
                {
                  data.ThucteZNS = new Date()
                  data.StatusZNS = 2
                  data.Status = 2
                  this.update(data.id, data)
                  const logger = {
                    Title: 'Thanh Toán',
                    Slug: 'thanhtoan',
                    Action: 'done',
                    Mota: `${SendZNS.Title} - SDT: ${data.SDT}`
                  }
                  this._LoggerService.create(logger)
                }
                break;
              default: {
                data.Status = 6
                this.update(data.id, data)
                const logger = {
                  Title: 'Thanh Toán',
                  Slug: 'thanhtoan',
                  Action: 'loitoken',
                  Mota: `${SendZNS.Title} - SDT: ${data.SDT} - Data: ${JSON.stringify(SendZNS.data)}`
                }
                this._LoggerService.create(logger)
              }
                break;
            }
          } catch (error) {
            console.error(`Error calling Zalozns service: ${error.message}`);
          }
        }
        else {
          data.Status = 3
          data.ThucteZNS = new Date()
          this.update(data.id, data)
          const logger = {
            Title: 'Thanh Toán',
            Slug: 'thanhtoan',
            Action: 'chuadangkycn',
            Mota: `Chi nhánh chưa đăng ký ZNS  - SDT: ${data.SDT}`
          }
          this._LoggerService.create(logger)
        }
    }
  // }
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
    const result = await this.findChecktime(data.checkTime)
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
    const Start = moment().add(-1, 'days').startOf('date').toDate()
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
  async findChecktime(time: string) {
    return await this.Vttech_thanhtoanRepository.findOne({
      where: { checkTime: time },
    });
  }
  async findInvoiceNum(InvoiceNum: string,checkTime:any) {
    return await this.Vttech_thanhtoanRepository.findOne({
      where: { 
        InvoiceNum: InvoiceNum,
        checkTime:checkTime
       },
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
    const checkTime = now.hour() >= 8 && now.hour() <= 21;
    return checkTime
  }
}
