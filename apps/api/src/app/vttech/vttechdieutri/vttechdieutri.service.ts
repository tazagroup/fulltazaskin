import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { VttechdieutriEntity } from './entities/vttechdieutri.entity';
import { SharedService } from '../../shared/shared.service';
import moment = require('moment');
import { CombineUnique, convertToZeroMinutesSeconds, mergeNoDup } from '../../shared.utils';
import axios from 'axios';
import { ChinhanhService } from '../../cauhinh/chinhanh/chinhanh.service';
import { LoggerService } from '../../logger/logger.service';
@Injectable()
export class VttechdieutriService {
  constructor(
    @InjectRepository(VttechdieutriEntity)
    private VttechdieutriRepository: Repository<VttechdieutriEntity>,
    private _SharedService: SharedService,
    private _ChinhanhService: ChinhanhService,
    private _LoggerService: LoggerService,
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
         TimeIndex: data.TimeIndex,
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
    console.log(params);
    const queryBuilder = this.VttechdieutriRepository.createQueryBuilder('vttechdieutri');
    if (params.hasOwnProperty('CreatedBegin') && params.hasOwnProperty('CreatedEnd')) {
      console.log(moment(params.CreatedBegin).isSame(moment(params.CreatedEnd)));
      if(moment(params.CreatedBegin).isSame(moment(params.CreatedEnd)))
        {
          queryBuilder.andWhere('vttechdieutri.Created = :startDate', {
            startDate: moment(params.CreatedBegin).format('YYYY-MM-DD')
          });
        }
        else {
          queryBuilder.andWhere('vttechdieutri.Created BETWEEN :startDate AND :endDate', {
            startDate:  moment(params.CreatedBegin).format('YYYY-MM-DD'),
            endDate:  moment(params.CreatedEnd).format('YYYY-MM-DD')
          });
        }
    }
    if (params.Title) {
      queryBuilder.andWhere('vttechdieutri.Title LIKE :Title', { SDT: `%${params.Title}%` });
    }
    if (params.hasOwnProperty('Status')) {
      queryBuilder.andWhere('vttechdieutri.Status = :Status', { Status: `${params.Status}` });
    }
    if (params.hasOwnProperty('BranchID')) {
     queryBuilder.andWhere('vttechdieutri.BranchID = :BranchID', { BranchID: `${params.BranchID}` });
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
    const logger ={
      Title:'Vttech Điều Trị',
      Slug:'vttechdieutri',
      Action:'create',
      Mota:`[VTTECH_DIEUTRI] - Step1 - Bắt Đầu Lấy Dữ Liệu Điều Trị - ${moment().format("HH:mm:ss DD/MM/YYYY")}`}
   this._LoggerService.create(logger)
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
        const Checkdata = {
          CustPhone: v.CustPhone,
          idVttech: convertToZeroMinutesSeconds(v.CreatedDate).getTime(),
          TabCode: v.Service.TabCode,
          TimeIndex: v.Service.TimeIndex,
        }
        const check = await this.findby(Checkdata);
        if (!check) {
          ListItems.push(v);
        }
      }));
      const logger ={
        Title:'Vttech Điều Trị',
        Slug:'vttechdieutri',
        Action:'create',
        Mota:`[VTTECH_DIEUTRI] - Lấy Dữ Liệu Điều Trị Thành Công (${ListItems.length}) - ${moment().format("HH:mm:ss DD/MM/YYYY")}`}
     this._LoggerService.create(logger)
      if (ListItems.length > 0) {
        ListItems.forEach(async (v: any, k: any) => {
          const item: any = {};
          item.Dulieu = v;
          item.idVttech = convertToZeroMinutesSeconds(v.CreatedDate).getTime();
          item.CustPhone = v.Phone;
          item.CustName = v.Name;
          item.BranchID = v.BranchID;
          item.TabCode = v.Service.TabCode;
          item.TimeIndex = v.Service.TimeIndex;
          item.Created = moment(v.CreatedDate).format('YYYY-MM-DD');
          setTimeout(async () => {
            const result = await this.create(item);
          }, k * 1000);
        });
      }
      return ListItems;
    } catch (error) {
      console.error(error);
      const logger ={
        Title:'Vttech Điều Trị',
        Slug:'vttechdieutri',
        Action:'create',
        Mota:`[VTTECH_DIEUTRI] - Lỗi Xác Thực - ${JSON.stringify(error)} - ${JSON.stringify(item)} - ${JSON.stringify(result)}`}
     this._LoggerService.create(logger)
      return error;
    }
  }

}
