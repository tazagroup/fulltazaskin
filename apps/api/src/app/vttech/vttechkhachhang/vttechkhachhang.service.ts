import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { VttechkhachhangEntity } from './entities/vttechkhachhang.entity';
import { SharedService } from '../../shared/shared.service';
import { TelegramService } from '../../shared/telegram.service';
@Injectable()
export class VttechkhachhangService {
  constructor(
    @InjectRepository(VttechkhachhangEntity)
    private VttechkhachhangRepository: Repository<VttechkhachhangEntity>,
    private _SharedService: SharedService,
    private _TelegramService: TelegramService,
  ) { }
  async create(data: any) {
    const check = await this.findby(data)
    if(!check) {
      this.VttechkhachhangRepository.create(data);
      return await this.VttechkhachhangRepository.save(data);
    }
    else {
      return { error: 1001, data: "Trùng Dữ Liệu" }
    }

  }

  async findAll() {
    return await this.VttechkhachhangRepository.find();
  }
  async findid(id: string) {
    return await this.VttechkhachhangRepository.findOne({ where: { id: id } });
  }
  async findby(data: any) {
    return await this.VttechkhachhangRepository.findOne({ 
      where: {
         SDT: data.SDT,
         idVttech: data.idVttech 
        },
     });
  }
  async findPagination(page: number, perPage: number) {
    const skip = (page - 1) * perPage;
    const totalItems = await this.VttechkhachhangRepository.count();
    const vttechkhachhangs = await this.VttechkhachhangRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: vttechkhachhangs,
    };
  }
  async findQuery(params: any) {
    console.error(params);
    const queryBuilder = this.VttechkhachhangRepository.createQueryBuilder('vttechkhachhang');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('vttechkhachhang.CreateAt BETWEEN :startDate AND :endDate', {
        startDate: params.Batdau,
        endDate: params.Ketthuc,
      });
    }
    if (params.Title) {
      queryBuilder.andWhere('vttechkhachhang.Title LIKE :Title', { SDT: `%${params.Title}%` });
    }
    const [items, totalCount] = await queryBuilder
      .limit(params.pageSize || 10) // Set a default page size if not provided
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();
    console.log(items, totalCount);

    return { items, totalCount };
  }
  async update(id: string, UpdateVttechkhachhangDto: any) {
    this.VttechkhachhangRepository.save(UpdateVttechkhachhangDto);
    return await this.VttechkhachhangRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.VttechkhachhangRepository.delete(id);
    return { deleted: true };
  }

   
  async getKhachhang(item: any = {}) {
    console.log(item);
    const result = await this._SharedService.getToken(item)    
    try {
      const response = await fetch(`https://apismsvtt.vttechsolution.com/api/Customer/GetList`, {
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
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();  
      if(data.Data.length>0){
        data.Data.forEach((v:any,k:any) => {
          const item:any={}
          item.Dulieu = v
          item.idVttech = v.ID
          item.Code = v.Code
          item.BranchID = v.BranchID
          item.Name = v.Name
          item.SDT = v.Phone   
          item.SDT2 = v.Phone2   
          setTimeout(() => {
            this.create(item); 
          }, k*200);       
        });
      }  
      return data
    } catch (error) {
      throw new Error(error);
      console.error(error.status);
      //this._TelegramService.SendMiniAppLogdev(`[VTTECH_KHACHHANG] - Lỗi Xác Thực - ${JSON.stringify(error.status)} - ${JSON.stringify(item)}`);
      return error;
    }
  }

}
