import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ZnsthanhtoanEntity } from './entities/znsthanhtoan.entity';
import { VttechthanhtoanService } from '../../vttech/vttechthanhtoan/vttechthanhtoan.service';
import { TelegramService } from '../../shared/telegram.service';
import moment = require('moment');
import { ChinhanhService } from '../../cauhinh/chinhanh/chinhanh.service';
@Injectable()
export class ZnsthanhtoanService {
  constructor(
    @InjectRepository(ZnsthanhtoanEntity)
    private ZnsthanhtoanRepository: Repository<ZnsthanhtoanEntity>,
    private _VttechthanhtoanService: VttechthanhtoanService,
    private _TelegramService: TelegramService,
    private _ChinhanhService: ChinhanhService,
  ) { }
  async createzns(data: any) {    
    const Thanhtoans = await this._VttechthanhtoanService.findQuery(data)
    this._TelegramService.SendMiniAppLogdev(`[ZNS_THANHTOAN] - Create ${Thanhtoans.length} Thanh Toan - ${moment().format('HH:mm:ss DD/MM/YYYY')}`);
    if(Thanhtoans.length>0) 
      {
        Thanhtoans.forEach((v:any,k:any) => {
          const item:any={}
          item.Dulieu = v
          item.CustPhone = v.CustPhone
          item.CustName = v.CustName
          item.CustCode = v.CustCode
          item.BranchID = v.BranchID
          item.Paid = v.Paid
          item.Code = v.Code       
          setTimeout(() => {
            this.create(item)
          }, k*300);
        });
      }
    return Thanhtoans
  }
  async sendzns(data: any) { 
    console.log(data);
    const Chinhanh = await this._ChinhanhService.findbyidVttech(data.BranchID)
    console.log(Chinhanh);
    return Chinhanh
    // try {
    //   const token: any = await this._ZalotokenService.findid(Chinhanh.idtoken);
    //   if (!token) {

    //   }
    //   else
    //   {

    //     // xacnhanthanhtoantaza(item: any, Chinhanh: any): any {
    //     //   const templateId = Chinhanh.idtemp;
    //     //   const priceProperty = templateId === '301891' || templateId === '302259' ? 'price' : 'cost';
    //     //   return {
    //     //     phone: convertPhoneNum(item.SDT),
    //     //     template_id: templateId,
    //     //     template_data: {
    //     //       order_code: item.InvoiceNum || 0,
    //     //       note: moment(item.Created).format('DD/MM/YYYY'),
    //     //       [priceProperty]: parseFloat(item.Bill.Amount).toFixed(0),
    //     //       customer_name: item.CustName,
    //     //     },
    //     //     tracking_id: GenId(12, true),
    //     //   };
    //     // }

    //   // const requestData = this.xacnhanthanhtoantaza(item, Chinhanh);
    //   // const config = {
    //   //   method: 'post',
    //   //   headers: {
    //   //     'access_token': token.Token.access_token,
    //   //     'Content-Type': 'application/json',
    //   //   },
    //   //   body: JSON.stringify(requestData)
    //   // };
    //   // const response = await fetch(`https://business.openapi.zalo.me/message/template`, config);
    // }
    // } catch (error) {
    //   throw error; // Rethrow for proper error propagation
    // }
  }
  async create(data: any) {
    const check = await this.findSHD(data)
    if(!check) {
      this.ZnsthanhtoanRepository.create(data);
      return await this.ZnsthanhtoanRepository.save(data);
    }
    else {
      return { error: 1001, data: "Trùng Dữ Liệu" }
    }

  }

  async findAll() {
    return await this.ZnsthanhtoanRepository.find();
  }
  async findid(id: string) {
    return await this.ZnsthanhtoanRepository.findOne({ where: { id: id } });
  }
  async findSHD(data: any) {
    return await this.ZnsthanhtoanRepository.findOne({
      where: {
        Code: data.Code,
        CustPhone: data.CustPhone
      },
    });
  }
  async findslug(Code: any) {
    return await this.ZnsthanhtoanRepository.findOne({
      where: { Code: Code },
    });
  }
  async findPagination(page: number, perPage: number) {
    const skip = (page - 1) * perPage;
    const totalItems = await this.ZnsthanhtoanRepository.count();
    const znsthanhtoans = await this.ZnsthanhtoanRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: znsthanhtoans,
    };
  }
  async findQuery(params: any) {
    console.error(params);
    const queryBuilder = this.ZnsthanhtoanRepository.createQueryBuilder('znsthanhtoan');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('znsthanhtoan.CreateAt BETWEEN :startDate AND :endDate', {
        startDate: params.Batdau,
        endDate: params.Ketthuc,
      });
    }
    if (params.Title) {
      queryBuilder.andWhere('znsthanhtoan.Title LIKE :Title', { SDT: `%${params.Title}%` });
    }
    const [items, totalCount] = await queryBuilder
      .limit(params.pageSize || 10) // Set a default page size if not provided
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();
    console.log(items, totalCount);

    return { items, totalCount };
  }
  async update(id: string, UpdateZnsthanhtoanDto: any) {
    this.ZnsthanhtoanRepository.save(UpdateZnsthanhtoanDto);
    return await this.ZnsthanhtoanRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.ZnsthanhtoanRepository.delete(id);
    return { deleted: true };
  }
}
