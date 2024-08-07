import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateZalodanhgiaDto } from './dto/create-zalodanhgia.dto';
import { UpdateZalodanhgiaDto } from './dto/update-zalodanhgia.dto';
import { ZalodanhgiaEntity } from './entities/zalodanhgia.entity';
import axios from 'axios';
import { LIST_CHI_NHANH, Phone_To_0 } from '../../shared.utils';
import { ZaloznstrackingService } from '../zaloznstracking/zaloznstracking.service';
import { error } from 'console';
import { LoggerService } from '../../logger/logger.service';
import { ZnsdieutriService } from '../../zns/znsdieutri/znsdieutri.service';
import moment = require('moment');
@Injectable()
export class ZalodanhgiaService {
  constructor(
    @InjectRepository(ZalodanhgiaEntity)
    private ZalodanhgiaRepository: Repository<ZalodanhgiaEntity>,
    private _ZnsdieutriService: ZnsdieutriService,
    private _ZaloznstrackingService: ZaloznstrackingService,
    private _LoggerService: LoggerService
  ) {}
  async create(data: any) {
    const checkdup = await this.findslug(data.msgId)
    if(checkdup)
    {
      return {error:1001,data:"Trùng Dữ Liệu"}
    }
    else
    {
      this.ZalodanhgiaRepository.create(data);
      return await this.ZalodanhgiaRepository.save(data);
    }

  }

  async findAll() {
    const result =  await this.ZalodanhgiaRepository.find();
    // result.forEach(v => {
    //     v.BranchID = LIST_CHI_NHANH.find((v1)=>v1.id==v.idCN)?.idVttech
    //     this.update(v.id,v)
    //     console.log(v.BranchID);

    // });
  }
  async findid(id: string) {
    return await this.ZalodanhgiaRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(msgId: any) {
    return await this.ZalodanhgiaRepository.findOne({
      where: { msgId: msgId},
    });
  }
  async findPagination(page: number, perPage: number){
    const skip = (page - 1) * perPage;
    const totalItems = await this.ZalodanhgiaRepository.count();
    const zalodanhgias = await this.ZalodanhgiaRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: zalodanhgias,
    };
  }
  async findQuery(params: any) {
    const queryBuilder = this.ZalodanhgiaRepository.createQueryBuilder('zalodanhgia');
    // if (params.Batdau && params.Ketthuc) {
    //   queryBuilder.andWhere('zalodanhgia.submitDate BETWEEN :startDate AND :endDate', {
    //     startDate:Begin,
    //     endDate:End,
    //   });
    // }
    const Begin = moment(params.CreatedBegin).startOf('day').valueOf()
    const End = moment(params.CreatedEnd).endOf('day').valueOf()
    console.log(Begin,End);
    if (params.hasOwnProperty('CreatedBegin') && params.hasOwnProperty('CreatedEnd')) {
          queryBuilder.andWhere('zalodanhgia.submitDate BETWEEN :startDate AND :endDate', {
            startDate:  Begin,
            endDate:  End
          });
    }
    if (params.hasOwnProperty("idCN")) {
      queryBuilder.andWhere('zalodanhgia.idCN = :idCN', { idCN: `${params.idCN}` });
    }
    if (params.hasOwnProperty('Status')) {
      queryBuilder.andWhere('zalodanhgia.Status LIKE :Status', { Status: `${params.Status}` });
    }
    if (params.hasOwnProperty('star')) {
      queryBuilder.andWhere('zalodanhgia.rate = :rate', { rate: `${params.star}` });
    }
    if (params.hasOwnProperty('BranchID')) {
      queryBuilder.andWhere('zalodanhgia.BranchID = :BranchID', { BranchID: `${params.BranchID}` });
    }
    let [result, totalCount] = await queryBuilder
      .limit(params.pageSize || 10)
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();
      await Promise.all(
        result.map(async (v:any) => {
          const Customer:any = await this._ZnsdieutriService.findbytrackingid(v.trackingId);
          if (Customer) {
            v.CustPhone = Phone_To_0(Customer.CustPhone);
            v.CustName = Customer.CustName;
          }
        })
      );
      if (params.hasOwnProperty('Dashboard')&& params.Dashboard==true) {
        const items = result.map((v)=>({rate:v.rate,submitDate:v.submitDate}))
        return { items, totalCount };
      }
      {
      const items = result
      return { items, totalCount };
      }

  }



  async update(id: string, UpdateZalodanhgiaDto: UpdateZalodanhgiaDto) {
    this.ZalodanhgiaRepository.save(UpdateZalodanhgiaDto);
    return await this.ZalodanhgiaRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.ZalodanhgiaRepository.delete(id);
    return { deleted: true };
  }
  async getDanhgia(data:any) {
    const Batdau = new Date(data.begin)
    const Ketthuc = new Date(data.end)
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://business.openapi.zalo.me/rating/get?template_id=${data.template_id}&from_time=${Batdau.getTime()}&to_time=${Ketthuc.getTime()}&offset=0&limit=1000`,
      headers: { 'access_token': data.access_token},
    };
    try {
      const response = await axios.request(config);
      if(response.data.error==0)
      {

        response.data.data.data.forEach(async (danhgia:any) => {
          let item:any = {}
          item.idCN = LIST_CHI_NHANH.find((v)=>v.idtempdanhgia==data.template_id||v.iddanhgiatimona==data.template_id)?.id
          item.BranchID = LIST_CHI_NHANH.find((v)=>v.idtempdanhgia==data.template_id||v.iddanhgiatimona==data.template_id)?.idVttech
          item.Chinhanh = LIST_CHI_NHANH.find((v)=>v.idtempdanhgia==data.template_id||v.iddanhgiatimona==data.template_id)?.Title
          item.trackingId = danhgia.trackingId
          item.oaId = danhgia.oaId
          item.feedbacks = danhgia.feedbacks
          item.msgId = danhgia.msgId
          item.rate = danhgia.rate
          item.submitDate = danhgia.submitDate
         // item.note = v?.note
          item.template_id = data.template_id
          item.Dulieu = danhgia
          const result = await this.create(item)
        });
      }
      return response.data

    } catch (error) {
      console.error(error);
    }
  }
}
