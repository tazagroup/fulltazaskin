import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { VttechdieutriEntity } from './entities/vttechdieutri.entity';
import { SharedService } from '../../shared/shared.service';
import { TelegramService } from '../../shared/telegram.service';
import moment = require('moment');
@Injectable()
export class VttechdieutriService {
  constructor(
    @InjectRepository(VttechdieutriEntity)
    private VttechdieutriRepository: Repository<VttechdieutriEntity>,
    private _SharedService: SharedService,
    private _TelegramService: TelegramService,
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
  async findby(data: any) {
    return await this.VttechdieutriRepository.findOne({ 
      where: {
        CustPhone: data.CustPhone,
         idVttech: data.idVttech 
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
  async findQuery(params: any={CreatedBegin:moment().format('YYYY-MM-DD'),CreatedEnd:moment().format('YYYY-MM-DD')}) {
    console.error(params);
    const queryBuilder = this.VttechdieutriRepository.createQueryBuilder('vttechdieutri');

    if (params.CreatedBegin && params.CreatedEnd) {
      queryBuilder.andWhere('vttechdieutri.Created BETWEEN :startDate AND :endDate', {
        startDate: params.CreatedBegin,
        endDate: params.CreatedEnd,
      });
    }
    if (params.Title) {
      queryBuilder.andWhere('vttechdieutri.Title LIKE :Title', { SDT: `%${params.Title}%` });
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
    console.log(item);
    const result = await this._SharedService.getToken(item)
    try {
      const response = await fetch(`https://apismsvtt.vttechsolution.com/api/Customer/GetTreat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${result[0].Token}`, 
          'Cookie': result[1],
        },
        body: JSON.stringify(item)
      });
      const data = await response.json();  
      this._TelegramService.SendMiniAppLogdev(`[VTTECH_DIEUTRI] - Lấy dữ liệu : ${moment().format("HH:mm:ss DD/MM/YYYY")} ${JSON.stringify(data.Data.length)}`);
      if(data.Data.length>0){
        data.Data.forEach((v:any,k:any) => {
          const item:any={}
          item.Dulieu = v
          item.idVttech = v.ID
          item.CustPhone = v.Phone   
          item.Created = moment(v.Created).format('YYYY-MM-DD')
          setTimeout(async () => {            
          const result = await this.create(item); 
          }, k*200);       

        });
      }  
      return data
    } catch (error) {
      console.error(error);
      this._TelegramService.SendMiniAppLogdev(`[VTTECH_DIEUTRI] - Lỗi Xác Thực - ${JSON.stringify(error)} - ${JSON.stringify(item)} - ${JSON.stringify(result)}`);
      return error;
    }
  }

}
