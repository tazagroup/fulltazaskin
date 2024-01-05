import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Like, Repository } from 'typeorm';
import { CreateVttechthanhtoanDto } from './dto/create-vttechthanhtoan.dto';
import { UpdateVttechthanhtoanDto } from './dto/update-vttechthanhtoan.dto';
import { VttechthanhtoanEntity } from './entities/vttechthanhtoan.entity';
import axios from 'axios';
import { CauhinhchungService } from '../../cauhinh/cauhinhchung/cauhinhchung.service';
import * as moment from 'moment';
import { TelegramService } from '../../shared/telegram.service';
import { LIST_CHI_NHANH } from '../../shared.utils';
import { ZaloznsService } from '../../zalo/zalozns/zalozns.service';
@Injectable()
export class VttechthanhtoanService {
  Cookie: any = ''
  XsrfToken: any = ''
  constructor(
    @InjectRepository(VttechthanhtoanEntity)
    private VttechthanhtoanRepository: Repository<VttechthanhtoanEntity>,
    private _CauhinhchungService: CauhinhchungService,
    private _TelegramService: TelegramService,
    private _ZaloznsService: ZaloznsService,
  ) {
    this._CauhinhchungService.findslug('vttechtoken').then((data: any) => {
      this.Cookie = data.Content.Cookie
      this.XsrfToken = data.Content.XsrfToken
    })
  }
  async getApiRealtime() {
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
      if (Array.isArray(response.data)) {
        const data1 = response.data;
        const data2 = await this.findAll();
        const uniqueInData2 = data1.filter((item: { Created: any; }) => !data2.some((data1Item) => this.Getdatetime(data1Item.Created) === this.Getdatetime(item.Created)));
        if (uniqueInData2.length > 0) {
          await Promise.all(uniqueInData2.map((v: any) => {
            v.Dulieu = JSON.stringify(v)
            this.create(v).then((item: any) => {
              // item.Dulieu = JSON.stringify(item)
              this.GetVttechKhachhang(item)
            })
          }));
          const result = `Code 201:  Cập Nhật Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b> Với Số Lượng: <b><u>${uniqueInData2.length}</u></b>`;
          this._TelegramService.SendLogdev(result);
          return { status: 201 };
        }
        else {
          const result = `Code 200: Cập Nhật Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b> Với Số Lượng: <b><u>0</u></b>`;
          this._TelegramService.SendLogdev(result);
          return { status: 200 };
        }
      }
      else {
        const result = "Code 403: Lỗi Xác thực"
        this._TelegramService.SendLogdev(result);
        return { status: 404, title: 'Lỗi Data Trả Về' };
      }
    } catch (error) {
      const result = `Lỗi Xác Thực Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b>`;
      this._TelegramService.SendLogdev(result);
      return { status: 400, title: 'Lỗi Xác Thực', Cookie: this.Cookie, 'Xsrf-Token': this.XsrfToken };
    }
  }
  async GetVttechKhachhang(item: any) {
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
        const hour = moment(item.Created).get("hour");
        if (hour < 19 && hour>9) {
          const Updatedata =
          {
            ...item,
            DukienZNS: new Date(),
            StatusZNS: 0,
            TimeZNS: new Date(),
            SDT: response.data.Table[0].CustomerPhone,
            InvoiceNum: Hoadon_id?.InvoiceNum,
          }
          this.sendZNSThanhtoan(Updatedata)
        } else {
          // Thời gian hiện tại lớn hơn 19h
        }
    } catch (error) {
      console.error(error);
    }
  }

  async GetKhachhang9h() {
      const now = new Date()
      const Start = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1, 19, 0, 0);
      const End = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
      const Thanhtoanpromise = await this.findbetween(Start, End)
      const [Thanhtoan] = await Promise.all([Thanhtoanpromise])   
      Thanhtoan.forEach(async (item:any) => {
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
            this.sendZNSThanhtoan(Updatedata)
        } catch (error) {
          console.error(error);
        }
      });
    return Thanhtoan.length
  }


  async sendZNSThanhtoan(data: any) {
    const Chinhanh = LIST_CHI_NHANH.find((v: any) => v.idVttech == data.BranchID)
    if (Chinhanh) {
      try {
        this._ZaloznsService.sendtestzns(data, Chinhanh).then((zns: any) => {
          if (zns) {
            if (zns.status == 'sms') {
              data.SMS = zns.data
              data.Status = 4
              this.update(data.id, data)
              const result = `<b><u>${zns.Title}</u></b>`;
              this._TelegramService.SendNoti(result)
            }
            else {
              data.ThucteZNS = new Date()
              data.StatusZNS = 2
              data.Status = 2
              this.update(data.id, data)
              const result = `<b><u>${zns.Title}</u></b>`;
              this._TelegramService.SendNoti(result)
            }
          }
        })
      } catch (error) {
        console.error(`Error calling Zalozns service: ${error.message}`);
      }
      data.Status = 1
      this.update(data.id, data)
      const result = `Thanh Toán : ${data.InvoiceNum} - ${data.CustName} - ${data.SDT} - ${moment(new Date()).format("HH:mm:ss DD/MM/YYYY")}`;
      this._TelegramService.SendNoti(result)
    }
    else {
      data.Status = 3
      this.update(data.id, data)
      const result = `Chi nhánh chưa đăng ký ZNS`;
      this._TelegramService.SendLogdev(result)
    }
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

  async update(id: string, data: any) {
    this.VttechthanhtoanRepository.save(data);
    return await this.VttechthanhtoanRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    await this.VttechthanhtoanRepository.delete(id);
    return { deleted: true };
  }
}
