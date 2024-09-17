import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { VttechkhachhangfinalEntity } from './entities/vttechkhachhangfinal.entity';
import { SharedService } from '../../shared/shared.service';
import moment = require('moment');
import { CombineUnique, convertToZeroMinutesSeconds, mergeNoDup } from '../../shared.utils';
import axios from 'axios';
import { ChinhanhService } from '../../cauhinh/chinhanh/chinhanh.service';
import { LoggerService } from '../../logger/logger.service';
@Injectable()
export class VttechkhachhangfinalService {
  constructor(
    @InjectRepository(VttechkhachhangfinalEntity)
    private VttechkhachhangfinalRepository: Repository<VttechkhachhangfinalEntity>,
    private _SharedService: SharedService,
    private _ChinhanhService: ChinhanhService,
    private _LoggerService: LoggerService,
  ) { }
  async create(data: any) {
    const check = await this.findby(data)
    if(!check) {
      this.VttechkhachhangfinalRepository.create(data);
      return await this.VttechkhachhangfinalRepository.save(data);
    }
    else {
      return { error: 1001, data: "Trùng Dữ Liệu" }
    }
  }
  async findAll() {
    return await this.VttechkhachhangfinalRepository.find();
  }
  async findid(id: string) {
    return await this.VttechkhachhangfinalRepository.findOne({ where: { id: id } });
  }
  async findidVttech(id: any) {
    return await this.VttechkhachhangfinalRepository.findOne({ where: { id: id } });
  }
  async findby(data: any) {
    return await this.VttechkhachhangfinalRepository.findOne({
      where: {},
     });
  }
  async findbycode(CustCode: string) {
    return await this.VttechkhachhangfinalRepository.findAndCount({ where: { CustCode: CustCode } });
  }
  async findPagination(page: number, perPage: number) {
    const skip = (page - 1) * perPage;
    const totalItems = await this.VttechkhachhangfinalRepository.count();
    const vttechkhachhangfinals = await this.VttechkhachhangfinalRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: vttechkhachhangfinals,
    };
  }
  async findQuery(params:any) {
    const queryBuilder = this.VttechkhachhangfinalRepository.createQueryBuilder('vttechkhachhangfinal');
    if (params.hasOwnProperty('CreatedBegin') && params.hasOwnProperty('CreatedEnd')) {
     console.log(moment(params.CreatedBegin).isSame(moment(params.CreatedEnd)));
      if(moment(params.CreatedBegin).isSame(moment(params.CreatedEnd)))
        {
          queryBuilder.andWhere('vttechkhachhangfinal.Created = :startDate', {
            startDate: moment(params.CreatedBegin).format('YYYY-MM-DD')
          });
        }
        else {
          queryBuilder.andWhere('vttechkhachhangfinal.Created BETWEEN :startDate AND :endDate', {
            startDate:  moment(params.CreatedBegin).format('YYYY-MM-DD'),
            endDate:  moment(params.CreatedEnd).format('YYYY-MM-DD')
          });
        }
    }
    JSON.stringify
    if (params.Title) {
      queryBuilder.andWhere('vttechkhachhangfinal.Title LIKE :Title', { SDT: `%${params.Title}%` });
    }
    if (params.hasOwnProperty('Status')) {
      queryBuilder.andWhere('vttechkhachhangfinal.Status = :Status', { Status: `${params.Status}` });
    }
    if (params.hasOwnProperty('BranchID')) {
     queryBuilder.andWhere('vttechkhachhangfinal.BranchID = :BranchID', { BranchID: `${params.BranchID}` });
    }
    const [items, totalCount] = await queryBuilder
      .limit(params.pageSize || 10) // Set a default page size if not provided
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();
    return items;
  }
  async update(id: string, UpdateVttechkhachhangfinalDto: any) {
    this.VttechkhachhangfinalRepository.save(UpdateVttechkhachhangfinalDto);
    return await this.VttechkhachhangfinalRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.VttechkhachhangfinalRepository.delete(id);
    return { deleted: true };
  }


  async getdieutri(item: any = {}) {
    console.log(item);

    const logger ={
      Title:'Vttech Điều Trị',
      Slug:'vttechkhachhangfinal',
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
      let CountCreate=0
      if (data.Data.length > 0) {
        console.log(data.Data.length);
      await Promise.all(data.Data.map(async (v: any, k: any) => {
          const item: any = {};
          item.Dulieu = v;
          item.idVttech = convertToZeroMinutesSeconds(v.CreatedDate).getTime();
          item.CustPhone = v.Phone;
          item.CustName = v.Name;
          item.CustCode = v.Code;
          item.BranchID = v.BranchID;
          item.TabCode = v.Service.TabCode;
          item.TimeIndex = v.Service.TimeIndex;
          item.Created = moment(v.CreatedDate).format('YYYY-MM-DD');
          const isCreate = await this.create(item);
          if (isCreate.error != 1001) {
            CountCreate = CountCreate + 1;
          }
      }));
    }
    return CountCreate;
    } catch (error) {
      console.error(error);
      const logger ={
        Title:'Vttech Điều Trị',
        Slug:'vttechkhachhangfinal',
        Action:'create',
        Mota:`[VTTECH_DIEUTRI] - Lỗi Xác Thực - ${JSON.stringify(error)} - ${JSON.stringify(item)} - ${JSON.stringify(result)}`}
     this._LoggerService.create(logger)
      return error;
    }
  }
}
