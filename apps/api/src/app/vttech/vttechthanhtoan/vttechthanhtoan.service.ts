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
  async findQuery(params: any={CreatedBegin:moment().format('YYYY-MM-DD'),CreatedEnd:moment().format('YYYY-MM-DD')}) {
    console.error(params);
    const queryBuilder = this.VttechthanhtoanRepository.createQueryBuilder('vttechthanhtoan');

    if (params.CreatedBegin && params.CreatedEnd) {
      queryBuilder.andWhere('vttechthanhtoan.Created BETWEEN :startDate AND :endDate', {
        startDate: params.CreatedBegin,
        endDate: params.CreatedEnd,
      });
    }
    if (params.Title) {
      queryBuilder.andWhere('vttechthanhtoan.CustPhone LIKE :Title', { CustPhone: `%${params.CustPhone}%` });
    }
    const [items, totalCount] = await queryBuilder
      .limit(params.pageSize || 10) // Set a default page size if not provided
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();
    const data = items.map((v: any) => (v.Dulieu))

  const mergedData = Object.values(data.reduce((acc:any, obj:any) => {
        const { CustPhone, Code, Paid } = obj;
        if (!acc[CustPhone]) {
            acc[CustPhone] = { ...obj };
        } else {
            acc[CustPhone].Paid += Paid;
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
    this._TelegramService.SendMiniAppLogdev(`[VTTECH_THANHTOAN] - Bắt Đầu Lấy Dữ Liệu Thanh Toán : ${moment().format("HH:mm:ss DD/MM/YYYY")} ${JSON.stringify(item)}`);
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
      this._TelegramService.SendMiniAppLogdev(`[VTTECH_THANHTOAN] - Đã Lấy (${JSON.stringify(data.Data.length)}) dữ liệu : ${moment().format("HH:mm:ss DD/MM/YYYY")}`);
      if (data.Data.length > 0) {
        data.Data.forEach(async (v: any, k: any) => {
          const item: any = {};
          item.Dulieu = v;
          item.idVttech = v.ID;
          item.CustPhone = v.CustPhone;
          item.Created = moment(v.Created).format('YYYY-MM-DD');
          await new Promise((resolve) => setTimeout(resolve, k * 200));
          await this.create(item);
        });
      }
      return data;
    } catch (error) {
      console.error(error);
      this._TelegramService.SendMiniAppLogdev(`[VTTECH_THANHTOAN] - Lỗi Xác Thực - ${JSON.stringify(error)} - ${JSON.stringify(item)} - ${JSON.stringify(result)}`);
      return error;
    }
  }

}
