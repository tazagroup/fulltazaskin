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
  ) {
    this._CauhinhchungService.findslug('zalotoken').then((data: any) => {
      this.Accesstoken = data.Content.Accesstoken
      // console.error(this.Accesstoken); 
    })
  }
  
  async sendtestzns(item: any, Chinhanh: any): Promise<{ status: string; Title: string; data?: string }> {
    try {
      const token:any = await this._ZalotokenService.findid(Chinhanh.idtoken);
      if (!token) {
        this._TelegramService.SendLogdev(JSON.stringify(token))
        throw new Error('Zalo token not found');
      }
      const requestData = this.constructRequestData(item, Chinhanh);
      const response = await axios.post<ZaloResponse>(
        'https://business.openapi.zalo.me/message/template',
        requestData,
        {
          headers: {
            'access_token': token.Token.access_token,
            'Content-Type': 'application/json',
          },
        }
      );
  
      this._TelegramService.SendLogdev(JSON.stringify(response.data));
  
      if (response.data.error === 0) {
        return { status: 'zns', Title: `ZNS có ID: ${response.data.data.msg_id} Đã Được Gửi` };
      } else {
        const smsResponse = await this.sendFallbackSMS(item);
        return { status: 'sms', Title: 'Lỗi Gửi ZNZ, Đã Gửi SMS', data: JSON.stringify(smsResponse.data) };
      }
    } catch (error) {
      this._TelegramService.SendLogdev(JSON.stringify(error));
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
        order_code: item.InvoiceNum,
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
    this._TelegramService.SendLogdev(JSON.stringify(response.data));
    return response;
  }

  async createzns(req: any) {
    const result: any = {}
    result.event_name = req.body.event_name
    result.ResponWebHook = req.body
    this.ZaloznsRepository.create(result);
    return await this.ZaloznsRepository.save(result);
  }
  // async sendtestzns(item: any,Chinhanh:any) {
  //   return await this._ZalotokenService.findid(Chinhanh.idCN).then((data: any) => {
  //    let item1:any={}
  //     if(Chinhanh.idtemp=='301891'||Chinhanh.idtemp=='302259')
  //     {
  //       item1 = {
  //         "phone": convertPhoneNum(item.SDT),
  //         "template_id": Chinhanh.idtemp,
  //         "template_data": {
  //           "order_code": item.InvoiceNum,
  //           "note": moment(item.Created).format('DD/MM/YYYY'),
  //           "price": parseFloat(item.Amount).toFixed(0),
  //           "customer_name": item.CustName
  //         },
  //         "tracking_id": GenId(12, true)
  //       }
  //     }
  //     else{
  //       item1 = {
  //         "phone": convertPhoneNum(item.SDT),
  //         "template_id": Chinhanh.idtemp,
  //         "template_data": {
  //           "order_code": item.InvoiceNum,
  //           "note": moment(item.Created).format('DD/MM/YYYY'),
  //           "code": parseFloat(item.Amount).toFixed(0),
  //           "customer_name": item.CustName
  //         },
  //         "tracking_id": GenId(12, true)
  //       }
  //     }
 
  //     if (data) {
  //       let config = {
  //         method: 'post',
  //         maxBodyLength: Infinity,
  //         url: 'https://business.openapi.zalo.me/message/template',
  //         headers: {
  //           'access_token': data.Token.access_token,
  //           'Content-Type': 'application/json'
  //         },
  //         data: item1
  //       };
  //       return axios.request(config)
  //         .then(async (response: any) => {
  //           console.error(response.data);
  //           this._TelegramService.SendLogdev(JSON.stringify(response.data))
  //           if (response.data.error != 0) {
  //             const sms = {
  //               "Brandname": "TAZA",
  //               "Message": `${item.CustName} da thanh toan so tien ${parseFloat(item.Amount).toFixed(0)} co ma hoa don la ${item.InvoiceNum}. Taza cam on quy khach`,
  //               "Phonenumber": convertPhoneNum(item.SDT),
  //               "user": "ctytaza2",
  //               "pass": "$2a$10$QjKAPJ9qq.RuS3jfUID2FeuGdpuSL1Rl9ugQUvy.O5PuKSlp8z95S",
  //               "messageId": GenId(8,true)
  //             }
  //            const SMSPromise = await this._SmsService.sendsms(sms)
  //             this._TelegramService.SendLogdev(JSON.stringify(SMSPromise.data))
  //             return {status:'sms',Title:'Lỗi Gửi ZNZ, Đã Gửi SMS',data:JSON.stringify(SMSPromise.data)}
  //           }
  //           else {
  //             this._TelegramService.SendLogdev(JSON.stringify(response.data))
  //             return {status:'zns',Title:`ZNS có ID : ${response.data?.data?.msg_id} Đã Được Gửi`}
  //           }
  //         })
  //         .catch((error) => {
  //           this._TelegramService.SendLogdev(JSON.stringify(error))
  //           return error
  //         });
  //     }
  //   });
  // }
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
    //   access_token = this.Accesstoken
    //   let data = item;
    //   let config = {
    //     method: 'post',
    //     maxBodyLength: Infinity,
    //     url: 'https://business.openapi.zalo.me/message/template',
    //     headers: { 
    //       'access_token': this.Accesstoken, 
    //       'Content-Type': 'application/json'
    //     },
    //     data : data
    //   };
    //  return axios.request(config)
    //   .then((response) => {
    //     //console.error(response.data);

    //     return response.data
    //   })
    //   .catch((error) => {
    //     return error
    //   });
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
    const filter = allData.map((v:any)=>v.ResponWebHook)    
    const queryBuilder = this.ZaloznsRepository.createQueryBuilder('zalozns');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('zalozns.CreateAt BETWEEN :startDate AND :endDate', {
        startDate:params.Batdau,
        endDate:params.Ketthuc,
      });
    }
    if (params.event_name) {
      queryBuilder.andWhere('zalozns.event_name LIKE :event_name', { event_name: `%${params.event_name}%` });
    }
    if (params.Status) {
      queryBuilder.andWhere('zalozns.Status LIKE :Status', { Status: `${params.Status}` });
    }
    const [items, totalCount] = await queryBuilder
    .limit(params.pageSize || 10)
    .offset(params.pageNumber * params.pageSize || 0)
    .getManyAndCount();
    items.forEach((v:any)=>{
     v.SDT =  Phone_To_0(filter.find((v1)=>v1.message.tracking_id==v.ResponWebHook.message.tracking_id).recipient.id)
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
}
