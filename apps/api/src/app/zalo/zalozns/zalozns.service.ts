import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ZaloznsEntity } from './entities/zalozns.entity';
import { CauhinhchungService } from '../../cauhinh/cauhinhchung/cauhinhchung.service';
import { ZalotokenService } from '../zalotoken/zalotoken.service';
import { GenId, convertPhoneNum, formatVND } from '../../shared.utils';
import moment = require('moment');
import axios from 'axios';
@Injectable()
export class ZaloznsService {
  Accesstoken: any = ''
  constructor(
    @InjectRepository(ZaloznsEntity)
    private ZaloznsRepository: Repository<ZaloznsEntity>,
    private _CauhinhchungService: CauhinhchungService,
    private _ZalotokenService: ZalotokenService,
  ) {
    this._CauhinhchungService.findslug('zalotoken').then((data: any) => {
      this.Accesstoken = data.Content.Accesstoken
      // console.error(this.Accesstoken); 
    })
  }

  async createzns(req: any) {
    const result: any = {}
    result.event_name = req.body.event_name
    result.ResponWebHook = req.body
    this.ZaloznsRepository.create(result);
    return await this.ZaloznsRepository.save(result);
  }
  async sendtestzns(item: any, idCN: any,idtemp:any) {
   return await this._ZalotokenService.findid(idCN).then((data: any) => {
      console.log(data,idCN);
      const item1 = {
        "phone": convertPhoneNum(item.SDT),
        "template_id": idtemp,
        "template_data": {
          "order_code": item.InvoiceNum,
          "note": moment(item.Created).format('DD/MM/YYYY'),
          "price": parseFloat(item.Amount).toFixed(0),
          "customer_name": item.CustName
        },
        "tracking_id": GenId(12,true)
      }
      if (data) {
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://business.openapi.zalo.me/message/template',
          headers: {
            'access_token': data.Token.access_token,
            'Content-Type': 'application/json'
          },
          data: item1
        };
        return axios.request(config)
          .then((response:any) => {
            console.error(response.data);
            if(response.data.error)
            {

              return response.data
            }
            else
            {
              return response.data
            }   
          })
          .catch((error) => {
            return error
          });
      }
    });
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
  async findQuery(query: string) {
    return await this.ZaloznsRepository.find({
      where: { event_name: Like(`%query%`) },
    });
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
