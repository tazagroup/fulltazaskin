import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { VttechdieutriEntity } from './entities/vttechdieutri.entity';
import { SharedService } from '../../shared/shared.service';
import { TelegramService } from '../../shared/telegram.service';
import moment = require('moment');
import { CombineUnique, convertToZeroMinutesSeconds, mergeNoDup } from '../../shared.utils';
import axios from 'axios';
import { ChinhanhService } from '../../cauhinh/chinhanh/chinhanh.service';
@Injectable()
export class VttechdieutriService {
  constructor(
    @InjectRepository(VttechdieutriEntity)
    private VttechdieutriRepository: Repository<VttechdieutriEntity>,
    private _SharedService: SharedService,
    private _TelegramService: TelegramService,
    private _ChinhanhService: ChinhanhService,
  ) { }
  async create(data: any) {
    const check = await this.findby(data)    
    if(!check) {
      this.VttechdieutriRepository.create(data);
      return await this.VttechdieutriRepository.save(data);
    }
    else {
      return { error: 1001, data: "Trùng Dữ Liệu" }
    }
  }
  async findAll() {
    return await this.VttechdieutriRepository.find();
  }
  async findid(id: string) {
    return await this.VttechdieutriRepository.findOne({ where: { id: id } });
  }
  async findidVttech(id: any) {
    return await this.VttechdieutriRepository.findOne({ where: { idVttech: id } });
  }
  async findby(data: any) {
    return await this.VttechdieutriRepository.findOne({ 
      where: {
         CustPhone: data.CustPhone,
         idVttech: data.idVttech, 
         TabCode: data.TabCode, 
        },
     });
  }
  async findPagination(page: number, perPage: number) {
    const skip = (page - 1) * perPage;
    const totalItems = await this.VttechdieutriRepository.count();
    const vttechdieutris = await this.VttechdieutriRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: vttechdieutris,
    };
  }
  async findQuery(params:any) {
    const queryBuilder = this.VttechdieutriRepository.createQueryBuilder('vttechdieutri');
    if (params.hasOwnProperty('CreatedBegin') && params.hasOwnProperty('CreatedEnd')) {
      console.log(params.CreatedBegin, params.CreatedEnd);
      if(params.CreatedBegin==params.CreatedEnd){
        queryBuilder.andWhere('vttechdieutri.Created = :Created', {
          Created: params.CreatedBegin,
        });
      }
      else{
      queryBuilder.andWhere('vttechdieutri.Created BETWEEN :startDate AND :endDate', {
        startDate: params.CreatedBegin,
        endDate: params.CreatedEnd,
      });
      }
    }
    if (params.Title) {
      queryBuilder.andWhere('vttechdieutri.Title LIKE :Title', { SDT: `%${params.Title}%` });
    }
    const [items, totalCount] = await queryBuilder
      .limit(params.pageSize || 10) // Set a default page size if not provided
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();  
    return items;
  }
  async update(id: string, UpdateVttechdieutriDto: any) {
    this.VttechdieutriRepository.save(UpdateVttechdieutriDto);
    return await this.VttechdieutriRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.VttechdieutriRepository.delete(id);
    return { deleted: true };
  }


  async getdieutri(item: any = {}) {      
    this._TelegramService.SendMiniAppLogdev(`[VTTECH_DIEUTRI] - Step1 - Bắt Đầu Lấy Dữ Liệu Điều Trị - ${moment().format("HH:mm:ss DD/MM/YYYY")}`);
    const result = await this._SharedService.getToken(item);
    try {
      const response = await axios.post(`https://apismsvtt.vttechsolution.com/api/Customer/GetTreat`, item, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${result[0].Token}`,
          'Cookie': result[1],
        },
      });
      const data = response.data;
      const ListItems:any=[]
      await Promise.all(data.Data.map(async (v: any) => {
        const check = await this.findidVttech(convertToZeroMinutesSeconds(v.CreatedDate).getTime());
        console.log(check);
        if (!check) {
          ListItems.push(v);
        }
      }));
      this._TelegramService.SendMiniAppLogdev(`[VTTECH_DIEUTRI] - Lấy Dữ Liệu Điều Trị Thành Công (${ListItems.length}) - ${moment().format("HH:mm:ss DD/MM/YYYY")}`);
      if (ListItems.length > 0) {
        ListItems.forEach(async (v: any, k: any) => {
          const item: any = {};
          item.Dulieu = v;
          item.idVttech = convertToZeroMinutesSeconds(v.CreatedDate).getTime();
          item.CustPhone = v.Phone;
          item.CustName = v.Name;
          item.BranchID = v.BranchID;
          item.TabCode = v.Service.TabCode;
          item.Created = moment(v.CreatedDate).format('YYYY-MM-DD');
          setTimeout(async () => {
            const result = await this.create(item);
          }, k * 200);
        });
      }
      return ListItems;
    } catch (error) {
      console.error(error);
      this._TelegramService.SendMiniAppLogdev(`[VTTECH_DIEUTRI] - Lỗi Xác Thực - ${JSON.stringify(error)} - ${JSON.stringify(item)} - ${JSON.stringify(result)}`);
      return error;
    }
  }

}
