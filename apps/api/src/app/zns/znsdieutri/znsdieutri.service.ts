import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ZnsdieutriEntity } from './entities/znsdieutri.entity';
import { VttechdieutriService } from '../../vttech/vttechdieutri/vttechdieutri.service';
import { TelegramService } from '../../shared/telegram.service';
import moment = require('moment');
import { ChinhanhService } from '../../cauhinh/chinhanh/chinhanh.service';
import { DescErrorZalo, GenId, convertPhoneNum } from '../../shared.utils';
@Injectable()
export class ZnsdieutriService {
  constructor(
    @InjectRepository(ZnsdieutriEntity)
    private ZnsdieutriRepository: Repository<ZnsdieutriEntity>,
    private _VttechdieutriService: VttechdieutriService,
    private _TelegramService: TelegramService,
    private _ChinhanhService: ChinhanhService,
  ) { }
  async createzns(data: any) {
    const Dieutris = await this._VttechdieutriService.findQuery(data)
    this._TelegramService.SendMiniAppLogdev(`[ZNS_DIEUTRI] - Create ${Dieutris.length} Dieu Tri - ${moment().format('HH:mm:ss DD/MM/YYYY')}`);
    if (Dieutris.length > 0) {
      const uniqueDieutris = Dieutris.reduce((acc: any[], curr: any) => {
        const existingDieutri = acc.find((d: any) => d.idVttech === curr.idVttech && d.CustPhone === curr.CustPhone);
        console.log(existingDieutri,curr.idVttech,curr.CustPhone);
        
        if (!existingDieutri) {
          acc.push(curr);
        }
        return acc;
      }, []);
      uniqueDieutris.forEach((v: any, k: any) => {
        const item: any = {}
        item.idVttech = v.idVttech
        item.idDieutri = v.id
        item.CustPhone = v.CustPhone
        item.CustName = v.CustName
        item.BranchID = v.BranchID
        item.Created =  moment(v.Created).format('YYYY-MM-DD')
        setTimeout(() => {
          this.create(item)
        }, k * 300);
      });
    }
    return Dieutris
  }
  async getTemplateData(id: any, token: any) {
    try {
      const response = await fetch(`https://business.openapi.zalo.me/template/info?template_id=${id}`, {
        method: 'GET',
        headers: {
          'access_token': token
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  // async sendsms(data: any) {
  //   try {
  //     const response = await fetch('https://sms.cmctelecom.vn/SMS_CMCTelecom/api/sms/sendutf', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(data)
  //     });
  //     const responseData = await response.json();
  //     return responseData;
  //   } catch (error) {
  //     return error;
  //   }
  // }

  async sendzns(data: any) {
    const Chinhanh: any = await this._ChinhanhService.findbyidVttech(data.BranchID)
    try {
      if (!Chinhanh?.ZaloOaToken?.access_token) {
        this._TelegramService.SendMiniAppLogdev(`[ZNS_DIEUTRI] - ${data.BranchID} - ${Chinhanh?.Title} - Chưa Có Token - ${moment().format('HH:mm:ss DD/MM/YYYY')}`);
      }
      else {
        const requestData = {
         // mode: "development",
          phone: convertPhoneNum(data.CustPhone),
          template_id: Chinhanh.TemplateDanhgia,
          template_data: {
            customer_name: data.CustName,
            schedule_date: moment(data.Created).format('DD/MM/YYYY')
          },
          tracking_id: GenId(12, true),
        };
        const config = {
          method: 'post',
          headers: {
            'access_token': Chinhanh.ZaloOaToken.access_token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        };
        // if (data.CustPhone == "0977272967") {
        const response = await fetch(`https://business.openapi.zalo.me/message/template`, config);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const result = await response.json();
        console.log(result);
        this._TelegramService.SendMiniAppLogdev(`[ZNS_DIEUTRI] - Mã Lỗi :  ${result.error} - ${DescErrorZalo(result.error)} - ${Chinhanh.Title} - ${data.CustName} - ${data.CustPhone} - ${data.Code} - ${data.Paid} - ${moment().format('HH:mm:ss DD/MM/YYYY')}`);
        if (result.error == 0) {
          data.Status = 1;
          data.message_id =result.data.msg_id;
          this.update(data.id, data)
        }
        else {
          data.Status = 2;
          data.Statuscode = result.error;
          this.update(data.id, data)
        }
        return result
      }
    } catch (error) {
      throw error;
    }
  }
  // async sendznsauto(data: any) {
  //   data.CreatedBegin?data.CreatedBegin = moment(data.CreatedBegin).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
  //   data.createdEnd?data.createdEnd = moment(data.createdEnd).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
  //   data.Status?data.Status = data.Status:0;
  //   const result = await this.findQuery(data)
  //   return result 
  // }
  async create(data: any) {
    const check = await this.findSHD(data)
    if (!check) {
      this.ZnsdieutriRepository.create(data);
      return await this.ZnsdieutriRepository.save(data);
    }
    else {
      return { error: 1001, data: "Trùng Dữ Liệu" }
    }

  }

  async findAll() {
    return await this.ZnsdieutriRepository.find();
  }
  async findid(id: string) {
    return await this.ZnsdieutriRepository.findOne({ where: { id: id } });
  }
  async findSHD(data: any) {
    return await this.ZnsdieutriRepository.findOne({
      where: {
        idVttech: data.idVttech,
        CustPhone: data.CustPhone
      },
    });
  }
  async findslug(Code: any) {
    return await this.ZnsdieutriRepository.findOne({
      where: { Code: Code },
    });
  }
  async findPagination(page: number, perPage: number) {
    const skip = (page - 1) * perPage;
    const totalItems = await this.ZnsdieutriRepository.count();
    const znsdieutris = await this.ZnsdieutriRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: znsdieutris,
    };
  }
  async findQuery(params: any) {
    const queryBuilder = this.ZnsdieutriRepository.createQueryBuilder('znsdieutri');
    if (params.hasOwnProperty('CreatedBegin') && params.hasOwnProperty('CreatedEnd')) {
      queryBuilder.andWhere('znsdieutri.Created BETWEEN :startDate AND :endDate', {
        startDate: params.CreatedBegin,
        endDate: params.CreatedEnd,
      });
    }
    if (params.hasOwnProperty('Batdau') && params.hasOwnProperty('Ketthuc')) {
      queryBuilder.andWhere('znsdieutri.CreateAt BETWEEN :startDate AND :endDate', {
        startDate: params.Batdau,
        endDate: params.Ketthuc,
      });
    }
    if (params.hasOwnProperty('Title')) {
      queryBuilder.andWhere('znsdieutri.Title LIKE :Title', { SDT: `%${params.Title}%` });
    }
    if (params.hasOwnProperty('Status')) {
      queryBuilder.andWhere('znsdieutri.Status = :Status', { Status: `${params.Status}` });
    }
    const [items, totalCount] = await queryBuilder
      .limit(params.pageSize || 10) // Set a default page size if not provided
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();
    console.log(items, totalCount);
    return { items, totalCount };
  }
  async update(id: string, UpdateZnsdieutriDto: any) {
    this.ZnsdieutriRepository.save(UpdateZnsdieutriDto);
    return await this.ZnsdieutriRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.ZnsdieutriRepository.delete(id);
    return { deleted: true };
  }
}
