import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { VttechthanhtoanEntity } from './entities/vttechthanhtoan.entity';
import { SharedService } from '../../shared/shared.service';
import { TelegramService } from '../../shared/telegram.service';
import moment = require('moment');
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
         SDT: data.SDT,
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
      queryBuilder.andWhere('vttechthanhtoan.Title LIKE :Title', { SDT: `%${params.Title}%` });
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
    console.log(item);
    const result = await this._SharedService.getToken(item)
    console.log(result);
    try {
      const response = await fetch(`https://apismsvtt.vttechsolution.com/api/Revenue/GetList`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'withCredentials': 'true',
          credentials: 'include',
          'Authorization': `Bearer ${result[0].Token}`, 
          'Cookie': result[1],
        },
        body: JSON.stringify(item)
      });
      const data = await response.json();  
      this._TelegramService.SendMiniAppLogdev(`[VTTECH_THANHTOAN] - Lấy dữ liệu : ${moment().format("HH:mm:ss DD/MM/YYYY")} ${JSON.stringify(data.Data.length)}`);
      if(data.Data.length>0){
        data.Data.forEach((v:any,k:any) => {
          const item:any={}
          item.Dulieu = v
          item.idVttech = v.ID
          item.SDT = v.CustPhone   
          item.Created = moment(v.Created).format('YYYY-MM-DD')
          setTimeout(() => {
            this.create(item); 
          }, k*200);       

        });
      }  
      return data
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
      this._TelegramService.SendMiniAppLogdev(`[VTTECH_THANHTOAN] - Lỗi Xác Thực - ${JSON.stringify(error.status)} - ${JSON.stringify(item)}`);
      return error;
    }
  }

}
