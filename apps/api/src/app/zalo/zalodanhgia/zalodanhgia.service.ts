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
@Injectable()
export class ZalodanhgiaService {
  constructor(
    @InjectRepository(ZalodanhgiaEntity)
    private ZalodanhgiaRepository: Repository<ZalodanhgiaEntity>,
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
    const Begin = new Date(params.Batdau).getTime()
    const End = new Date(params.Ketthuc).getTime()    
    const queryBuilder = this.ZalodanhgiaRepository.createQueryBuilder('zalodanhgia');
    const queryBuilder1 = this.ZalodanhgiaRepository.createQueryBuilder('zalodanhgia');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('zalodanhgia.submitDate BETWEEN :startDate AND :endDate', {
        startDate:Begin,
        endDate:End,
      });
      queryBuilder1.andWhere('zalodanhgia.submitDate BETWEEN :startDate AND :endDate', {
        startDate:Begin,
        endDate:End,
      });
    }
    if (params.hasOwnProperty("idCN")&&params.idCN!=0) {
      queryBuilder.andWhere('zalodanhgia.idCN = :idCN', { idCN: `${params.idCN}` });
      queryBuilder1.andWhere('zalodanhgia.idCN = :idCN', { idCN: `${params.idCN}` });
    }
    if (params.hasOwnProperty('Status')) {
      queryBuilder.andWhere('zalodanhgia.Status LIKE :Status', { Status: `${params.Status}` });
    }
    if (params.hasOwnProperty('star')) {
      queryBuilder.andWhere('zalodanhgia.rate = :rate', { rate: `${params.star}` });
    }
    let [items, totalCount] = await queryBuilder
      .limit(params.pageSize || 10)
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();
      await Promise.all(
        items.map(async (v) => {
          const ZNS = await this._ZaloznstrackingService.findtrackingid(v.trackingId);
          if (ZNS) {
            v.SDT = Phone_To_0(ZNS.SDT);
          }
        })
      );      
    const [result] = await queryBuilder1.getManyAndCount();
    const ListStatus = result.map((v: any) => ({ rate: v.rate }))
    return { items, totalCount, ListStatus };
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
        
        response.data.data.data.forEach(async (v:any) => {
          let item:any = {}
          item.idCN = LIST_CHI_NHANH.find((v)=>v.idtempdanhgia==data.template_id)?.id
          item.BrandId = LIST_CHI_NHANH.find((v)=>v.idtempdanhgia==data.template_id)?.idVttech
          item.Chinhanh = LIST_CHI_NHANH.find((v)=>v.idtempdanhgia==data.template_id)?.Title
          item.trackingId = v.trackingId
          item.oaId = v.oaId
          item.feedbacks = v.feedbacks
          item.msgId = v.msgId
          item.rate = v.rate
          item.submitDate = v.submitDate
          item.note = v.note
          item.template_id = data.template_id
          item.Dulieu = v
          const result = await this.create(item)
          const logger = {
            Title: 'Đánh Giá Từ Khách hàng',
            Slug: 'danhgiazalo',
            Action: 'addnew',
            Mota: `Thêm mới Zalo Đánh Giá ${JSON.stringify(result)}`
          }
          this._LoggerService.create(logger)
        });
      }
      return response.data

    } catch (error) {
      console.error(error);
    }
  }
}
