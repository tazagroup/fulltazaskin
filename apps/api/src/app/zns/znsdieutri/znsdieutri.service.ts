import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ZnsdieutriEntity } from './entities/znsdieutri.entity';
import { VttechdieutriService } from '../../vttech/vttechdieutri/vttechdieutri.service';
import moment = require('moment');
import { ChinhanhService } from '../../cauhinh/chinhanh/chinhanh.service';
import { DescErrorZalo, GenId, convertPhoneNum } from '../../shared.utils';
import { ZaloznstrackingService } from '../../zalo/zaloznstracking/zaloznstracking.service';
import { LoggerService } from '../../logger/logger.service';
import axios from 'axios';
import { RediscacheService } from '../../rediscache.service';
@Injectable()
export class ZnsdieutriService {
  constructor(
    @InjectRepository(ZnsdieutriEntity)
    private ZnsdieutriRepository: Repository<ZnsdieutriEntity>,
    private _VttechdieutriService: VttechdieutriService,
    private _ChinhanhService: ChinhanhService,
    private _LoggerService: LoggerService,
    private _RediscacheService: RediscacheService,
  ) { }
  async createzns(data: any) {
    console.error(data);
    const Dieutris = await this._VttechdieutriService.findQuery(data)
    console.error(Dieutris.length);
    if (Dieutris.length > 0) {
      const uniqueDieutris = Dieutris.filter((obj, index, self) =>
        self.findIndex(other => moment(other.Created).isSame(moment(obj.Created)) && other.CustPhone == obj.CustPhone && other.BranchID == obj.BranchID) == index
      );
      console.log(uniqueDieutris.length);
       const logger = {
        Title: 'ZNS Điều Trị',
        Slug: 'dieutri',
        Action: 'create',
        Mota: `[ZNS_DIEUTRI] - Step2 - Create (${uniqueDieutris.length}) Dieu Tri - ${moment().format('HH:mm:ss DD/MM/YYYY')}`
      }
      this._LoggerService.create(logger)


      // uniqueDieutris.forEach((v: any, k: any) => {
      //   const item: any = {}
      //   item.idVttech = v.idVttech
      //   item.idDieutri = v.id
      //   item.CustPhone = v.CustPhone
      //   item.CustName = v.CustName
      //   item.BranchID = v.BranchID
      //   item.Created = moment(v.Created).format('YYYY-MM-DD')
      //   setTimeout(() => {
      //     this.create(item)
      //   }, k * 1000);
      // });
      // return uniqueDieutris.length

      let CountCreate=0
      if (uniqueDieutris.length > 0) {
        console.log(uniqueDieutris.length);
      await Promise.all(uniqueDieutris.map(async (v: any, k: any) => {
        const item: any = {}
        item.idVttech = v.idVttech
        item.idDieutri = v.id
        item.CustPhone = v.CustPhone
        item.CustName = v.CustName
        item.BranchID = v.BranchID
        item.Created = moment(v.Created).format('YYYY-MM-DD')
          const isCreate = await this.create(item);
          if (isCreate.error != 1001) {
            CountCreate = CountCreate + 1;
          }
      }));
    }
    return CountCreate;

    }
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
    // try {
    if (!Chinhanh?.ZaloOaToken?.access_token) {
      const logger = {
        Title: 'ZNS Điều Trị',
        Slug: 'dieutri',
        Action: 'send',
        Status: 'error_token',
        Mota: `[ZNS_DIEUTRI] - ${data.BranchID} - ${Chinhanh?.Title} - Chưa Có Token - ${moment().format('HH:mm:ss DD/MM/YYYY')}`
      }
      this._LoggerService.create(logger)

      data.Status = 3;
      this.update(data.id, data)
    }
    else {
      let requestData: any = {}
      if (Chinhanh.Congty == 'tazaskin') {
        requestData = {
          // mode: "development",
          phone: convertPhoneNum(data.CustPhone),
          template_id: Chinhanh.TemplateDanhgia,
          template_data: {
            customer_name: data.CustName,
            schedule_date: moment(data.Created).format('DD/MM/YYYY')
          },
          tracking_id: data.CustPhone || data.CustName || GenId(12, true),
        };

      }
      else if (Chinhanh.Congty == 'timona'){
        requestData = {
          // mode: "development",
          phone: convertPhoneNum(data.CustPhone),
          template_id: Chinhanh.TemplateDanhgia,
          template_data: {
            Ten_Hoc_Vien: data.CustName,
            Ngay_Su_Dung: moment(data.Created).format('DD/MM/YYYY'),
            Ma_hoa_don: Chinhanh.Title.replace(/Timona Academy /g, "")
          },
          tracking_id: data.CustPhone || data.CustName || GenId(12, true),
        };
      }
      // if (data.CustPhone == "0977272967") {
      const response = await axios.post('https://business.openapi.zalo.me/message/template', JSON.stringify(requestData),
        {
          headers: {
            'access_token': Chinhanh.ZaloOaToken.access_token,
            'Content-Type': 'application/json',
          }
        });
      if (response.status !== 200) {
        const logger = {
          Title: 'ZNS Điều Trị',
          Slug: 'dieutri',
          Action: 'send',
          Status: 'error',
          Mota: `[ZNS_DIEUTRI] - Mã Lỗi 1 :  ${JSON.stringify(response.statusText)}`
        }
        this._LoggerService.create(logger)
        data.ZNSData.status = "error"
        data.ZNSData.code = response?.status
        data.ZNSData.error = response?.statusText
        this.update(data.id, data)
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const result = await response.data;
      const logger = {
        Title: 'ZNS Điều Trị',
        Slug: 'dieutri',
        Action: 'send',
        Status: 'error',
        Mota: `[ZNS_DIEUTRI] - Mã Lỗi 2 :  ${JSON.stringify(result)} - ${DescErrorZalo(result.error)} - ${Chinhanh.Title} - ${data.CustName} - ${data.CustPhone} - ${data.Code} - ${data.Paid} - ${moment().format('HH:mm:ss DD/MM/YYYY')}`
      }
      this._LoggerService.create(logger)
      if (result.error == 0) {
        data.Status = 1;
        data.messageId = result.data.msg_id;
        data.trackingId = requestData.tracking_id;
        data.ZNSData.status = "success";
        data.ZNSData.code =result.error
        this.update(data.id, data)
      }
      else {
        data.Status = 2;
        data.Statuscode = result.error;
        data.ZNSData.status = "error";
        data.ZNSData.code =result.error
        this.update(data.id, data)
      }
      return result
      // } catch (error) {
      //   console.log(error);

    }
  }
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
  async findbytrackingid(trackingId: string) {
    return await this.ZnsdieutriRepository.findOne({ where: { trackingId: trackingId } });
  }
  async findSHD(data: any) {
    return await this.ZnsdieutriRepository.findOne({
      where: {
        Created: data.Created,
        CustPhone: data.CustPhone,
        BranchID: data.BranchID
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
      // console.log(moment(params.CreatedBegin).isSame(moment(params.CreatedEnd)));
      if (moment(params.CreatedBegin).isSame(moment(params.CreatedEnd))) {
        queryBuilder.andWhere('znsdieutri.Created = :startDate', {
          startDate: moment(params.CreatedBegin).format('YYYY-MM-DD')
        });
      }
      else {
        queryBuilder.andWhere('znsdieutri.Created BETWEEN :startDate AND :endDate', {
          startDate: moment(params.CreatedBegin).format('YYYY-MM-DD'),
          endDate: moment(params.CreatedEnd).add(1, 'day').format('YYYY-MM-DD')
        });
      }
    }
    if (params.hasOwnProperty('Title')) {
      queryBuilder.andWhere('znsdieutri.Title LIKE :Title', { SDT: `%${params.Title}%` });
    }
    if (params.hasOwnProperty('Status')) {
      queryBuilder.andWhere('znsdieutri.Status = :Status', { Status: `${params.Status}` });
    }
    if (params.hasOwnProperty('BranchID')) {
      queryBuilder.andWhere('znsdieutri.BranchID = :BranchID', { BranchID: `${params.BranchID}` });
    }
    const [result, totalCount] = await queryBuilder
      .limit(params.pageSize || 10) // Set a default page size if not provided
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();
      if (params.hasOwnProperty('Dashboard')&& params.Dashboard==true) {
        const item = result.map((v)=>({Status:v.Status,Created:v.Created}))
        const items = await this._RediscacheService.getDataWithCache('znsdieutri', item)
        return { items, totalCount };
       }
      {
      const items = await this._RediscacheService.getDataWithCache('znsdieutri', result)
      return { items, totalCount };
      }
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
