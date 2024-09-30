import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { VttechlichhenEntity } from './entities/vttechlichhen.entity';
import axios from 'axios';
import { SharedService } from '../../shared/shared.service';
import { LoggerService } from '../../logger/logger.service';
import moment = require('moment');
@Injectable()
export class VttechlichhenService {
  constructor(
    @InjectRepository(VttechlichhenEntity)
    private VttechlichhenRepository: Repository<VttechlichhenEntity>,
    private _SharedService: SharedService,
    private _LoggerService: LoggerService,
  ) { }
  async create(data: any) {
    const check = await this.findcheck(data)
    if(!check) {
      this.VttechlichhenRepository.create(data);
      return await this.VttechlichhenRepository.save(data);
    }
    else {
      return { error: 1001, data: "Trùng Dữ Liệu" }
    }

  }

  async findAll() {
    return await this.VttechlichhenRepository.find();
  }
  async findbycode(CustCode: string) {
    return await this.VttechlichhenRepository.find({ where: { CustCode: CustCode } });
  }
  async findcheck(data: any) {
    return await this.VttechlichhenRepository.findOne({
      where: {
        VttechID:data.VttechID,
        CustCode: data.CustCode,
      },
    });
  }
  async findslug(CustID: any) {
    return await this.VttechlichhenRepository.findOne({
      where: { CustID: CustID },
    });
  }
  async findAllslug(CustID: any) {
    return await this.VttechlichhenRepository.find({
      where: { CustID: CustID },
    });
  }
  async findPagination(page: number, perPage: number) {
    const skip = (page - 1) * perPage;
    const totalItems = await this.VttechlichhenRepository.count();
    const vttechlichhens = await this.VttechlichhenRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: vttechlichhens,
    };
  }
  async findQuery(params: any) {
    console.error(params);
    const queryBuilder = this.VttechlichhenRepository.createQueryBuilder('vttechlichhen');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('vttechlichhen.CreateAt BETWEEN :startDate AND :endDate', {
        startDate: params.Batdau,
        endDate: params.Ketthuc,
      });
    }
    if (params.Title) {
      queryBuilder.andWhere('vttechlichhen.Title LIKE :Title', { SDT: `%${params.Title}%` });
    }
    const [items, totalCount] = await queryBuilder
      .limit(params.pageSize || 10) // Set a default page size if not provided
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();
    console.log(items, totalCount);

    return { items, totalCount };
  }
  async update(id: string, UpdateVttechlichhenDto: any) {
    this.VttechlichhenRepository.save(UpdateVttechlichhenDto);
    return await this.VttechlichhenRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.VttechlichhenRepository.delete(id);
    return { deleted: true };
  }
  async getLichhen(item: any = {}) {
    console.log(item);
    
    const result = await this._SharedService.getToken(item);
    try {
      const response = await axios.post('https://apismsvtt.vttechsolution.com/api/Appointment/GetList', item, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${result[0].Token}`,
          'Cookie': result[1],
        },
      });
      const data = response.data;
      if (data.Data.length > 0) {
        data.Data.map(async (v: any, k: any) => {
          const item: any = {};
          item.Dulieu = v;
          item.VttechID = v.ID;
          item.Code = v.Code;
          item.CustID = v.CustID;
          item.CustCode = v.CustCode;
          item.CustName = v.CustName;
          item.DateFrom = v.DateFrom;
          item.CreatedDate = v.CreatedDate;
          item.StatusID = v.StatusID;
          item.StatusName = v.StatusName;
          item.BranchID = v.BranchID;
          item.BranchName = v.BranchName;
          item.Content = v.Content;
          await new Promise((resolve) => setTimeout(resolve, k * 200));
          await this.create(item);
        });
        const logger ={
          Title:'Vttech Lịch Hẹn',
          Slug:'vttechlichhen',
          Action:'create',
          Mota:`[VTTECH_LICHHEN] - Hoàn Thành Đồng Bộ Dữ Liệu - ${data.Data.length} - ${moment().format('HH:mm:ss DD/MM/YYYY')}`}
       this._LoggerService.create(logger)
      }
      return data;
    } catch (error) {
      const logger ={
        Title:'Vttech Lịch Hẹn',
        Slug:'vttechlichhen',
        Action:'create',
        Mota:`[VTTECH_LICHHEN] - Lỗi Xác Thực - ${JSON.stringify(error.status)} - ${JSON.stringify(item)}`}
     this._LoggerService.create(logger)
    }
  }
}
