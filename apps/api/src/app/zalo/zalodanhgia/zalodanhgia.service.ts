import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateZalodanhgiaDto } from './dto/create-zalodanhgia.dto';
import { UpdateZalodanhgiaDto } from './dto/update-zalodanhgia.dto';
import { ZalodanhgiaEntity } from './entities/zalodanhgia.entity';
import axios from 'axios';
import { LIST_CHI_NHANH, Phone_To_0 } from '../../shared.utils';
import { ZaloznstrackingService } from '../zaloznstracking/zaloznstracking.service';
@Injectable()
export class ZalodanhgiaService {
  constructor(
    @InjectRepository(ZalodanhgiaEntity)
    private ZalodanhgiaRepository: Repository<ZalodanhgiaEntity>,
    private _ZaloznstrackingService: ZaloznstrackingService
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
    return await this.ZalodanhgiaRepository.find();
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
    console.error(params);
    const queryBuilder = this.ZalodanhgiaRepository.createQueryBuilder('zalodanhgia');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('zalodanhgia.CreateAt BETWEEN :startDate AND :endDate', {
        startDate:params.Batdau,
        endDate:params.Ketthuc,
      });
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
      items.forEach(async (v:any)=>{
      const ZNS = await this._ZaloznstrackingService.findtrackingid(v.trackingId)
        if(ZNS.SDT){
          v.SDT = Phone_To_0(ZNS.SDT)
        }
      })   
      return { items, totalCount };
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
        
        response.data.data.data.forEach((v:any) => {
          let item:any = {}
          item.idCN = LIST_CHI_NHANH.find((v)=>v.idtempdanhgia==data.template_id)?.id
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
          this.create(item)
        });
      }
      return response.data

    } catch (error) {
      console.error(error);
    }
  }
}
