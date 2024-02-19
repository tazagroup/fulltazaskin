import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ZaloznsEntity } from './entities/zalozns.entity';
import { CauhinhchungService } from '../../cauhinh/cauhinhchung/cauhinhchung.service';
import { ZalotokenService } from '../zalotoken/zalotoken.service';
import { GenId, Phone_To_0, convertPhoneNum, formatVND } from '../../shared.utils';
import moment = require('moment');
import axios from 'axios';
import { SmsService } from '../../sms/sms.service';
import { TelegramService } from '../../shared/telegram.service';
import { ZalodanhgiaService } from '../zalodanhgia/zalodanhgia.service';
import Zalodanhgia from '../zalodanhgia/zalodanhgia';
import { ZaloznstrackingService } from '../zaloznstracking/zaloznstracking.service';
import { LoggerService } from '../../logger/logger.service';
interface ZaloResponse {
  error: number;
  data?: { msg_id: string };
}
@Injectable()
export class ZaloznsService {
  Accesstoken: any = ''
  constructor(
    @InjectRepository(ZaloznsEntity)
    private ZaloznsRepository: Repository<ZaloznsEntity>,
    private _CauhinhchungService: CauhinhchungService,
    private _ZalotokenService: ZalotokenService,
    private _SmsService: SmsService,
    private _TelegramService: TelegramService,
    private _ZalodanhgiaService: ZalodanhgiaService,
    private _ZaloznstrackingService: ZaloznstrackingService,
    private _LoggerService: LoggerService,
  ) {
    this._CauhinhchungService.findslug('zalotoken').then((data: any) => {
      this.Accesstoken = data.Content.Accesstoken
      // console.error(this.Accesstoken); 
    })
  }

  async sendThanhtoanTaza(item: any, Chinhanh: any) {
    try {
      const token: any = await this._ZalotokenService.findid(Chinhanh.idtoken);
      if (!token) {
        const logger = { Title: 'Gửi ZNS', Mota: `Lỗi Xác Thực ${JSON.stringify(Chinhanh)}` }
        this._LoggerService.create(logger)
        return { status: false, Title: `Lỗi Xác Thực ${JSON.stringify(Chinhanh)}` };
      }
      else
      {
      const requestData = this.xacnhanthanhtoantaza(item, Chinhanh);
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://business.openapi.zalo.me/message/template`,
        headers: {
          'access_token': token.Token.access_token,
          'Content-Type': 'application/json',
        },
        data:requestData
      };
      const response = await axios.request(config)
      if (response.data.error === 0) {
        let dulieu: any={};
        dulieu.SDT = item.SDT
        dulieu.Hoten = item.CustName
        dulieu.tracking_id = requestData.tracking_id
        dulieu.msg_id = response.data.data.msg_id
        dulieu.template_id = requestData.tempDanhgiaid
        this._ZaloznstrackingService.create(dulieu)
        return { status: 'zns', Title: `Thanh Toán : ${response.data.data.msg_id} - SDT: ${item.SDT} Đã Được Gửi` };
      } else {
        if(this.CheckTime())
        {
        const smsResponse = await this.sendFallbackSMS(item);
         return { status: 'sms', Title: `Thanh Toán Lỗi ZNS :${item.InvoiceNum} Gửi SMS`, data: JSON.stringify(smsResponse.data) };
        }
      }
    }
    } catch (error) {
      throw error; // Rethrow for proper error propagation
    }
  }

  async TemplateDanhgiaTaza(item: any, Chinhanh: any){
    try {
      const token: any = await this._ZalotokenService.findid(Chinhanh.idtoken);
      if (!token) {
        const logger = { Title: 'Gửi ZNS', Mota: `Lỗi Xác Thực ${JSON.stringify(Chinhanh)}` }
        this._LoggerService.create(logger)
        return { status: false, Title: `Lỗi Xác Thực ${JSON.stringify(Chinhanh)}` };
      }
      else
      {
      const requestData = this.danhgiadichvutaza(item, Chinhanh);
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://business.openapi.zalo.me/message/template`,
        headers: {
          'access_token': token.Token.access_token,
          'Content-Type': 'application/json',
        },
        data:requestData
      };
      const response = await axios.request(config)
      if (response.data.error === 0) {
        let dulieu: any={};
        dulieu.SDT = requestData.phone
        dulieu.Hoten = item.CustName
        dulieu.tracking_id = requestData.tracking_id
        dulieu.msg_id = response.data.data.msg_id
        dulieu.template_id = response.data.tempDanhgiaid
        this._ZaloznstrackingService.create(dulieu)
        return { status: 'zns', Title: `Đánh Giá : ${response.data.data.msg_id} - ${item.id} - ${item.SDT} - ${item.CustName} Đã Được Gửi` };
      }
      else
      {
        return { status: false, Title: `Lỗi data trả về` };
      }
    }
    } catch (error) {
      throw error; // Rethrow for proper error propagation
    }
  }

  async sendThanhtoanTimona(item: any, Chinhanh: any) {
    try {
      const token: any = await this._ZalotokenService.findid(Chinhanh.idtoken);
      if (!token) {
        const logger = { Title: 'Gửi ZNS', Mota: `Lỗi Xác Thực ${JSON.stringify(Chinhanh)}` }
        this._LoggerService.create(logger)
        return { status: false, Title: `Lỗi Xác Thực ${JSON.stringify(Chinhanh)}` };
      }
      else
      {
      const requestData = this.xacnhanthanhtoantimona(item, Chinhanh);
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://business.openapi.zalo.me/message/template`,
        headers: {
          'access_token': token.Token.access_token,
          'Content-Type': 'application/json',
        },
        data:requestData
      };
      const response = await axios.request(config)
      console.log(response.data);    
      if (response.data.error === 0) {
        let dulieu: any={};
        dulieu.SDT = item.SDT
        dulieu.Hoten = item.CustName
        dulieu.tracking_id = requestData.tracking_id
        dulieu.msg_id = response.data.data.msg_id
        dulieu.template_id = requestData.tempDanhgiaid
        this._ZaloznstrackingService.create(dulieu)
        return { status: 'zns', Title: `Thanh Toán : ${response.data.data.msg_id} - SDT: ${item.SDT} Đã Được Gửi` };
      } else {
        if(this.CheckTime())
        {
        const smsResponse = await this.sendFallbackSMSTimona(item);
         return { status: 'sms', Title: `Thanh Toán Lỗi ZNS :${item.InvoiceNum} Gửi SMS`, data: JSON.stringify(smsResponse.data) };
        }
      }
    }
    } catch (error) {
      throw error; // Rethrow for proper error propagation
    }
  }


  async TemplateDanhgiaTimona(item: any, Chinhanh: any){
    console.log(Chinhanh);
    try {
      const token: any = await this._ZalotokenService.findid(Chinhanh.idtoken);
      if (!token) {
        const logger = { Title: 'Gửi ZNS', Mota: `Lỗi Xác Thực ${JSON.stringify(Chinhanh)}` }
        this._LoggerService.create(logger)
        return { status: false, Title: `Lỗi Xác Thực ${JSON.stringify(Chinhanh)}` };
      }
      else
      {
      const requestData = this.danhgiadichvutimona(item, Chinhanh);
      console.log(requestData);  
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://business.openapi.zalo.me/message/template`,
        headers: {
          'access_token': token.Token.access_token,
          'Content-Type': 'application/json',
        },
        data:requestData
      };
      const response = await axios.request(config)
      if (response.data.error === 0) {
        let dulieu: any={};
        dulieu.SDT = requestData.phone
        dulieu.Hoten = item.CustName
        dulieu.tracking_id = requestData.tracking_id
        dulieu.msg_id = response.data.data.msg_id
        dulieu.template_id = response.data.tempDanhgiaid
        this._ZaloznstrackingService.create(dulieu)
        return { status: 'zns', Title: `Đánh Giá : ${response.data.data.msg_id} - ${item.id} - ${item.SDT} - ${item.CustName} Đã Được Gửi` };
      }
      else
      {
        return { status: false, Title: `Lỗi data trả về` };
      }
    }
    } catch (error) {
      console.error(`Error calling Zalozns service: ${error.message}`);
      throw error; // Rethrow for proper error propagation
    }
  }
  
  constructRequestData(item: any, Chinhanh: any): any {
    const templateId = Chinhanh.idtemp;
    const priceProperty = templateId === '301891' || templateId === '302259' ? 'price' : 'cost';
    return {
      phone: convertPhoneNum(item.SDT),
      template_id: templateId,
      template_data: {
        order_code: item.InvoiceNum || 0,
        note: moment(item.Created).format('DD/MM/YYYY'),
        [priceProperty]: parseFloat(item.Amount).toFixed(0),
        customer_name: item.CustName,
      },
      tracking_id: GenId(12, true),
    };
  }

  async sendFallbackSMS(item: any): Promise<any> {
    const sms = {
      Brandname: 'TAZA',
      Message: `${item.CustName} da thanh toan so tien ${parseFloat(item.Amount).toFixed(0)} co ma hoa don la ${item.InvoiceNum}. Taza cam on quy khach`,
      Phonenumber: convertPhoneNum(item.SDT),
      user: 'ctytaza2',
      pass: '$2a$10$QjKAPJ9qq.RuS3jfUID2FeuGdpuSL1Rl9ugQUvy.O5PuKSlp8z95S',
      messageId: GenId(8, true),
    };
    const response = await this._SmsService.sendsms(sms);
    const logger = { Title: 'Gửi Sms', Mota: `Lỗi Xác Thực ${JSON.stringify(response)}` }
    this._LoggerService.create(logger)
    return response;
  }

  async sendFallbackSMSTimona(item: any): Promise<any> {
    // const sms = {
    //   Brandname: 'TAZA',
    //   Message: `${item.CustName} da thanh toan so tien ${parseFloat(item.Amount).toFixed(0)} co ma hoa don la ${item.InvoiceNum}. Taza cam on quy khach`,
    //   Phonenumber: convertPhoneNum(item.SDT),
    //   user: 'ctytaza2',
    //   pass: '$2a$10$QjKAPJ9qq.RuS3jfUID2FeuGdpuSL1Rl9ugQUvy.O5PuKSlp8z95S',
    //   messageId: GenId(8, true),
    // };
    // const response = await this._SmsService.sendsms(sms);
    // const logger = { Title: 'Gửi Sms', Mota: `Lỗi Xác Thực ${JSON.stringify(response)}` }
    // this._LoggerService.create(logger)
    // return response;
  }

  async createzns(req: any) {
    const result: any = {}
    result.event_name = req.body.event_name
    result.ResponWebHook = req.body
    if (req.body.event_name == 'user_feedback') {
      result.star = req.body.message.star
      let item: Zalodanhgia;
      item.note = req.body.message.note
      item.rate = req.body.message.rate
      item.submitDate = req.body.message.submit_time
      item.feedbacks = req.body.message.feedbacks
      item.trackingId = req.body.message.tracking_id
      item.oaId = req.body.oa_id
      this._ZalodanhgiaService.create(item)
    }
    this.ZaloznsRepository.create(result);
    return await this.ZaloznsRepository.save(result);
  }

  async sendZns(item: any, idCN: any) {
    await this._ZalotokenService.findid(idCN).then((data: any) => {
      if (data) {
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://business.openapi.zalo.me/message/template',
          headers: {
            'access_token': data.Token.access_token,
            'Content-Type': 'application/json'
          },
          data: item
        };
        return axios.request(config)
          .then((response) => {
            //console.error(response.data);

            return response.data
          })
          .catch((error) => {
            return error
          });
      }
    });
  }
  async getRating(msgid: any) {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://business.openapi.zalo.me/rating/get?template_id=272889&from_time=1701972000000&to_time=1703926793000&offset=0&limit=100',
      headers: {
        'access_token': 'W0ZlC6Tv_sA41kCrP7FzR8SDvJrZP98L_4hoG5uzgnRNJCiaQ5EgF-mWiXj0DFS8fWMcBIGNxNd5C_PrGJRp9_15xp1NR8Osic7YRX5Ll6ppKyDO4MQQLwGNy4SL9x9nimQlGH0UrNEKQBb61NxeHPjfc7S5US0baGsk3JHzgolGUCyUPtFM5uPviHyNJCPDWccnRM0Rj5RuRzDmIdsQMCfmv04eKPWQaME3A2LytWIuSgunEKNh8OH8WYuDTyiNj0QfJmm4pKMf3OHDCtBEGD5lZ5P1MS5O-sQH3sTluHl_Ru8rU1-TFUnixJPCOx0l_Lt_569ybI__QzKc11dC5EONiaLl9yDHpowEPomvxtEbHv1ZFLgAOBXKqrKQUgbYZqlAS0Dceoc75DqxEZsY4KFMHoXXOc7sPG'
      }
    };

    return axios.request(config)
      .then((response) => {
        if (response) {
          const result = response.data.data.data.find((v: any) => v.msgId == msgid)
          return result
        }
        else {
          return null
        }
      })
      .catch((error) => {
        return error
      });
  }
  async create(CreateZaloznsDto: any) {
    this.ZaloznsRepository.create(CreateZaloznsDto);
    return await this.ZaloznsRepository.save(CreateZaloznsDto);
  }

  async findAll() {
    const List = await this.ZaloznsRepository.find();
    // List.forEach((v:any) => {
    //   if(v.ResponWebHook.event_name=='user_feedback')
    //   {
    //     v.star = v.ResponWebHook?.message?.rate
    //     this.update(v.id,v)
    //   }
    // });
    return List
  }
  async findid(id: string) {
    return await this.ZaloznsRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(slug: any) {
    return await this.ZaloznsRepository.findOne({
      where: { Slug: slug },
    });
  }
  async findeventname(data: any) {
    return await this.ZaloznsRepository.find({
      where: { event_name: data },
    });
  }
  async findPagination(page: number, perPage: number) {
    const skip = (page - 1) * perPage;
    const totalItems = await this.ZaloznsRepository.count();
    const zaloznss = await this.ZaloznsRepository.find({ skip: skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: zaloznss,
    };
  }
  async findQuery(params: any) {
    const allData = await this.findeventname('user_received_message')
    const filter = allData.map((v: any) => v.ResponWebHook)
    const queryBuilder = this.ZaloznsRepository.createQueryBuilder('zalozns');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('zalozns.CreateAt BETWEEN :startDate AND :endDate', {
        startDate: params.Batdau,
        endDate: params.Ketthuc,
      });
    }
    if (params.event_name) {
      queryBuilder.andWhere('zalozns.event_name LIKE :event_name', { event_name: `%${params.event_name}%` });
    }
    if (params.hasOwnProperty('Status')) {
      queryBuilder.andWhere('zalozns.Status LIKE :Status', { Status: `${params.Status}` });
    }
    if (params.hasOwnProperty('star')) {
      queryBuilder.andWhere('zalozns.star = :star', { star: `${params.star}` });
    }
    const [items, totalCount] = await queryBuilder
      .limit(params.pageSize || 10)
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();
    items.forEach((v: any) => {
      const GetPhone = filter.find((v1) => v1.message.tracking_id == v.ResponWebHook.message.tracking_id)
      if (GetPhone) {
        v.SDT = Phone_To_0(GetPhone.recipient.id)
      }

    })
    return { items, totalCount };
  }
  async update(id: string, UpdateZaloznsDto: any) {
    this.ZaloznsRepository.save(UpdateZaloznsDto);
    return await this.ZaloznsRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    //console.error(id)
    await this.ZaloznsRepository.delete(id);
    return { deleted: true };
  }
  async updatetracking() {
    const wh = await this.findAll()
    wh.forEach((v:any,k:any) => {
      setTimeout(() => {
        let item:any={}
        if(v.event_name=="user_received_message")
        {
          item.msg_id = v?.ResponWebHook?.message?.msg_id
          item.tracking_id = v?.ResponWebHook?.message?.tracking_id
          item.SDT = v?.ResponWebHook?.recipient?.id
          this._ZaloznstrackingService.create(item)
        }
      }, k+Math.floor(Math.random() * 1000));
    });
    return wh.filter((v)=>v.event_name=="user_received_message").length
  }
  CheckTime() {
    const now = moment();
    const checkTime = now.hour() >= 8 && now.hour() <= 21;
    return checkTime
  }

//Template
    danhgiadichvutimona(item: any, Chinhanh: any): any {
      const tempDanhgiaid = Chinhanh.iddanhgiatimona;
      return {
        phone: convertPhoneNum(item.SDT),
        template_id: tempDanhgiaid,
        template_data: {
            Ten_Hoc_Vien: item.CustName,
            Ma_hoa_don: Chinhanh.Title,
            Ngay_Su_Dung: moment(new Date(Number(item.checkTime))).format('DD/MM/YYYY')
        },
        tracking_id: GenId(12, true),
      };
    }
    xacnhanthanhtoantimona(item: any, Chinhanh: any): any {
      const templateId = Chinhanh.idxacnhantimona;      
      return {
        phone: convertPhoneNum(item.SDT),
        template_id: templateId,
        template_data: {
          order_code: item.InvoiceNum || 0,
          date: moment(item.Created).format('DD/MM/YYYY'),
          student_name: item.CustName,
          cost: parseFloat(item.Amount).toFixed(0),
        },
        tracking_id: GenId(12, true),
      };
    }
    xacnhanthanhtoanhocphitimona(item: any, Chinhanh: any): any {
      const templateId = Chinhanh.idtemp;
      const priceProperty = templateId === '301891' || templateId === '302259' ? 'price' : 'cost';
      return {
        phone: convertPhoneNum(item.SDT),
        template_id: templateId,
        template_data: {
          order_code: item.InvoiceNum || 0,
          note: moment(item.Created).format('DD/MM/YYYY'),
          [priceProperty]: parseFloat(item.Amount).toFixed(0),
          customer_name: item.CustName,
        },
        tracking_id: GenId(12, true),
      };
    }
    danhgiadichvutaza(item: any, Chinhanh: any): any {
      console.log('SendZNS',item);
      
      const templateId = Chinhanh.idtempdanhgia;
      return {
        phone: convertPhoneNum(item.SDT),
        template_id: templateId,
        template_data: {
          schedule_date: moment(item.CreateAt).format('DD/MM/YYYY'),
          customer_name: item.CustName,
        },
        tracking_id: GenId(12, true),
      };
    }
    xacnhanthanhtoantaza(item: any, Chinhanh: any): any {
      const templateId = Chinhanh.idtemp;
      const priceProperty = templateId === '301891' || templateId === '302259' ? 'price' : 'cost';
      return {
        phone: convertPhoneNum(item.SDT),
        template_id: templateId,
        template_data: {
          order_code: item.InvoiceNum || 0,
          note: moment(item.Created).format('DD/MM/YYYY'),
          [priceProperty]: parseFloat(item.Amount).toFixed(0),
          customer_name: item.CustName,
        },
        tracking_id: GenId(12, true),
      };
    }

}
