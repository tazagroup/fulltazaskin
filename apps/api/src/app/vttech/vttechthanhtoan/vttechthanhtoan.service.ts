import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { VttechthanhtoanEntity } from './entities/vttechthanhtoan.entity';
import { SharedService } from '../../shared/shared.service';
import { TelegramService } from '../../shared/telegram.service';
import moment = require('moment');
import axios from 'axios';
@Injectable()
export class VttechthanhtoanService {
  constructor(
    @InjectRepository(VttechthanhtoanEntity)
    private VttechthanhtoanRepository: Repository<VttechthanhtoanEntity>,
    private _SharedService: SharedService,
    private _TelegramService: TelegramService,
  ) { }
  async create(data: any) {
    const check = await this.findby(data)    
    if(!check) {
      this.VttechthanhtoanRepository.create(data);
      return await this.VttechthanhtoanRepository.save(data);
    }
    else {
      return { error: 1001, data: "Trùng Dữ Liệu" }
    }

  }

  async findAll() {
    return await this.VttechthanhtoanRepository.find();
  }
  async findid(id: string) {
    return await this.VttechthanhtoanRepository.findOne({ where: { id: id } });
  }
  async findby(data: any) {
    return await this.VttechthanhtoanRepository.findOne({ 
      where: {
         CustPhone: data.CustPhone,
         idVttech: data.idVttech 
        },
     });
  }
  async findPagination(page: number, perPage: number) {
    const skip = (page - 1) * perPage;
    const totalItems = await this.VttechthanhtoanRepository.count();
    const vttechthanhtoans = await this.VttechthanhtoanRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: vttechthanhtoans,
    };
  }
  async findQuery(params:any) {
    const queryBuilder = this.VttechthanhtoanRepository.createQueryBuilder('vttechthanhtoan');
    // if (params.CreatedBegin && params.CreatedEnd) {
    //   queryBuilder.andWhere('vttechthanhtoan.Created BETWEEN :startDate AND :endDate', {
    //     startDate: params.CreatedBegin,
    //     endDate: params.CreatedEnd,
    //   });
    // }
    if (params.hasOwnProperty('CreatedBegin') && params.hasOwnProperty('CreatedEnd')) {
      console.log(moment(params.CreatedBegin).isSame(moment(params.CreatedEnd)));
      if(moment(params.CreatedBegin).isSame(moment(params.CreatedEnd)))
        {
          queryBuilder.andWhere('vttechthanhtoan.Created = :startDate', {
            startDate: moment(params.CreatedBegin).format('YYYY-MM-DD')
          });
        }
        else {
          queryBuilder.andWhere('vttechthanhtoan.Created BETWEEN :startDate AND :endDate', {
            startDate:  moment(params.CreatedBegin).format('YYYY-MM-DD'),
            endDate:  moment(params.CreatedEnd).format('YYYY-MM-DD')
          });
        }
    }
    if (params.hasOwnProperty('Title')) {
      queryBuilder.andWhere('vttechthanhtoan.Title LIKE :Title', { SDT: `${params.Title}` });
    }
    if (params.hasOwnProperty('Status')) {
      queryBuilder.andWhere('vttechthanhtoan.Status = :Status', { Status: `${params.Status}` });
    }
    if (params.hasOwnProperty('BranchID')) {
     queryBuilder.andWhere('vttechthanhtoan.Dulieu.BranchID = :BranchID', { BranchID: `${params.BranchID}` });
    }

    const [items, totalCount] = await queryBuilder
      .limit(params.pageSize || 10) // Set a default page size if not provided
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();
    const data = items.map((v: any) => (v.Dulieu))
    const mergedData = Object.values(data.reduce((acc, obj) => {
      const { CustPhone, Code, Paid } = obj;
      const key = `${CustPhone}-${Code}`;
    
      if (!acc[key]) {
        acc[key] = { ...obj };
      } else {
        acc[key].Paid += Paid;
      }
      return acc;
    }, {}));
    return mergedData;
  }
  async update(id: string, UpdateVttechthanhtoanDto: any) {
    this.VttechthanhtoanRepository.save(UpdateVttechthanhtoanDto);
    return await this.VttechthanhtoanRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.VttechthanhtoanRepository.delete(id);
    return { deleted: true };
  }


  async getThanhtoan(item: any = {}) {
    this._TelegramService.SendMiniAppLogdev(`[VTTECH_THANHTOAN] - Step1 - Bắt Đầu Lấy Dữ Liệu Thanh Toán : ${moment().format("HH:mm:ss DD/MM/YYYY")}`);
    const result = await this._SharedService.getToken(item);
    try {
      const response = await axios.post(`https://apismsvtt.vttechsolution.com/api/Revenue/GetList`, item, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${result[0].Token}`,
          'Cookie': result[1],
        },
      });
      const data = response.data;
      const ListItems:any=[]
      await Promise.all(data.Data.map(async (v: any) => {
        const check = await this.findby({idVttech:v.ID,CustPhone:v.CustPhone,Code:v.Code});
        if (!check) {
          ListItems.push(v);
        }
      }));

      this._TelegramService.SendMiniAppLogdev(`[VTTECH_THANHTOAN] - Đã Lấy (${JSON.stringify(ListItems.length)}) dữ liệu : ${moment().format("HH:mm:ss DD/MM/YYYY")}`);
      if (ListItems.length > 0) {
        ListItems.forEach(async (v: any, k: any) => {
          const item: any = {};
          item.Dulieu = v;
          item.idVttech = v.ID;
          item.CustPhone = v.CustPhone;
          item.Code = v.Code;
          item.Created = moment(v.Created).format('YYYY-MM-DD');
          setTimeout(async () => {
            const result = await this.create(item);
          }, k * 1000);
        });
      }
      return ListItems;
    } catch (error) {
      console.error(error);
      this._TelegramService.SendMiniAppLogdev(`[VTTECH_THANHTOAN] - Lỗi Xác Thực - ${JSON.stringify(error)} - ${JSON.stringify(item)} - ${JSON.stringify(result)}`);
      return error;
    }
  }

}
