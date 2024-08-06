import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { VttechlichsuthanhtoanEntity } from './entities/vttechlichsuthanhtoan.entity';
import moment = require('moment');
import { SharedService } from '../../shared/shared.service';
import { TelegramService } from '../../shared/telegram.service';
import axios from 'axios';
@Injectable()
export class VttechlichsuthanhtoanService {
  constructor(
    @InjectRepository(VttechlichsuthanhtoanEntity)
    private VttechlichsuthanhtoanRepository: Repository<VttechlichsuthanhtoanEntity>,
    private _SharedService: SharedService,
    private _TelegramService: TelegramService,
  ) { }
  async getAPI(data: any = {}) {
    const DataInit =
    {
      "DateFrom": "2024-04-09",
      "DateTo": "2024-04-09",
      "PagingNumber": "1",
      "Name": "Taza",
      "Password": "1b9287d492b256x7taza",
      "Type": "web"
  }
    data.DateFrom = data?.DateFrom ? moment(data.DateFrom).format('YYYY-MM-DD') : DataInit.DateFrom;
    data.DateTo = data?.DateTo ? moment(data.DateTo).format('YYYY-MM-DD') : DataInit.DateTo;
    data.PagingNumber = data?.PagingNumber ? data.PagingNumber : DataInit.PagingNumber;
    data.Name = data?.Name ? data.Name : DataInit.Name;
    data.Password = data?.Password ? data.Password : DataInit.Password;
    data.Type = data?.Type ? data.Type : DataInit.Type;
    console.log(data);
    const Token = await this._SharedService.getToken(data)
    try {
      // const response = await fetch(`https://apismsvtt.vttechsolution.com/api/Revenue/GetListByBranch`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'withCredentials': 'true',
      //     credentials: 'include',
      //     'Authorization': `Bearer ${Token[0].Token}`,
      //     'Cookie': Token[1],
      //   },
      //   body: JSON.stringify(data)
      // });

      const config = {
        method: 'post',
        url: 'https://apismsvtt.vttechsolution.com/api/Revenue/GetListByBranch',
        headers: {
          'Content-Type': 'application/json',
          'withCredentials': true,
          'Authorization': `Bearer ${Token[0].Token}`,
          'Cookie': Token[1],
        },
        data: data, // Data goes directly in the Axios config
      };
      const response = await axios.request(config)
      const result = await response.data;
      return result
      // const Lichsuthuchi = data.Master;
      // Lichsuthuchi.filter((v:any)=>v.VoucherType==-1 || v.VoucherType==-3 || v.VoucherType==-5);
      // Lichsuthuchi.forEach(async (v: any) => {
      //   const checkCode = await this.findByCode(v.Code);
      //   console.log(v);
      //   console.log(checkCode);
      //   if (checkCode) {
      //     console.log("Trùng Hoá Đơn");
      //     this._TelegramService.SendMiniAppLogdev(`[VTTECH_THANHTOAN] - Trùng Hoá Đơn ${v.Code} - ${v.CustPhone}`);
      //     this._LoggerService.create({ Title: 'Thanh Toán Từ Vttech', Mota: `Trùng Hoá Đơn ${v.Code} - ${v.CustPhone}` });
      //   }
      //   else {
      //   const item: any = {
      //     Code: v.Code,
      //     SDT: v.CustPhone,
      //     Amount: v.Amount,
      //     BranchID: v.BranchID,
      //     CustomerID: v.CustID,
      //     CustCode: v.CustCode,
      //     CustName: v.CustName,
      //     DocCode: v.CustDocCode,
      //     Created: v.Created,
      //     Type: v.VoucherType
      //   };
      //   const result = await this.createLichsu(item);
      //   console.log(result);
      //   }
      // })

    } catch (error) {
      console.error(error.status);
      this._TelegramService.SendMiniAppLogdev(`[VTTECH_THANHTOAN] - Lỗi Xác Thực - ${JSON.stringify(error.status)} - ${JSON.stringify(data)}`);
      return error;
    }
  }



  async create(data: any) {
    const check = await this.findSHD(data)
    if(!check) {
      this.VttechlichsuthanhtoanRepository.create(data);
      return await this.VttechlichsuthanhtoanRepository.save(data);
    }
    else {
      return { error: 1001, data: "Trùng Dữ Liệu" }
    }

  }

  async findAll() {
    return await this.VttechlichsuthanhtoanRepository.find();
  }
  async findid(id: string) {
    return await this.VttechlichsuthanhtoanRepository.findOne({ where: { id: id } });
  }
  async findSHD(data: any) {
    return await this.VttechlichsuthanhtoanRepository.findOne({
      where: {
        Title: data.Title,
        Type: data.Type
      },
    });
  }
  async findslug(Title: any) {
    return await this.VttechlichsuthanhtoanRepository.findOne({
      where: { Title: Title },
    });
  }
  async findPagination(page: number, perPage: number) {
    const skip = (page - 1) * perPage;
    const totalItems = await this.VttechlichsuthanhtoanRepository.count();
    const vttechlichsuthanhtoans = await this.VttechlichsuthanhtoanRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: vttechlichsuthanhtoans,
    };
  }
  async findQuery(params: any) {
    console.error(params);
    const queryBuilder = this.VttechlichsuthanhtoanRepository.createQueryBuilder('vttechlichsuthanhtoan');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('vttechlichsuthanhtoan.CreateAt BETWEEN :startDate AND :endDate', {
        startDate: params.Batdau,
        endDate: params.Ketthuc,
      });
    }
    if (params.Title) {
      queryBuilder.andWhere('vttechlichsuthanhtoan.Title LIKE :Title', { SDT: `%${params.Title}%` });
    }
    const [items, totalCount] = await queryBuilder
      .limit(params.pageSize || 10) // Set a default page size if not provided
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();
    console.log(items, totalCount);

    return { items, totalCount };
  }
  async update(id: string, data: any) {
    this.VttechlichsuthanhtoanRepository.save(data);
    return await this.VttechlichsuthanhtoanRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.VttechlichsuthanhtoanRepository.delete(id);
    return { deleted: true };
  }
}
