import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ZnsthanhtoanEntity } from './entities/znsthanhtoan.entity';
import { VttechthanhtoanService } from '../../vttech/vttechthanhtoan/vttechthanhtoan.service';
import moment = require('moment');
import { ChinhanhService } from '../../cauhinh/chinhanh/chinhanh.service';
import { DescErrorZalo, GenId, convertPhoneNum } from '../../shared.utils';
import { ZaloznstrackingService } from '../../zalo/zaloznstracking/zaloznstracking.service';
import { LoggerService } from '../../logger/logger.service';
@Injectable()
export class ZnsthanhtoanService {
  constructor(
    @InjectRepository(ZnsthanhtoanEntity)
    private ZnsthanhtoanRepository: Repository<ZnsthanhtoanEntity>,
    private _VttechthanhtoanService: VttechthanhtoanService,
    private _LoggerService:LoggerService,
    private _ChinhanhService: ChinhanhService,
    private _ZaloznstrackingService: ZaloznstrackingService,
  ) { }
  async createzns(data: any) {
    const Thanhtoans = await this._VttechthanhtoanService.findQuery(data);
    if (Thanhtoans.length > 0) {
      let CountCreate = 0;
      await Promise.all(Thanhtoans.map(async (v: any, k: any) => {
        const item: any = {};
        item.Dulieu = v;
        item.CustPhone = v.CustPhone;
        item.CustName = v.CustName;
        item.CustCode = v.CustCode;
        item.BranchID = v.BranchID;
        item.Code = v.Code;
        item.idVttech = v.idVttech
        item.Created = moment(v.Created).format('YYYY-MM-DD');
        item.Paid = v.Paid;
        const isCreate = await this.create(item);
        // console.error(isCreate);
        if (isCreate.error != 1001) {
          CountCreate = CountCreate + 1;
        }
      }));
      const logger ={
        Title:'Vttech ZNS Thanh Toán',
        Slug:'vttechznsthanhtoan',
        Action:'send',
        Mota:`[ZNS_THANHTOAN] - Step2 - Create (${CountCreate}) Thanh Toan - ${moment().format('HH:mm:ss DD/MM/YYYY')}`}
     this._LoggerService.create(logger)
    }
    return Thanhtoans;
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
      console.error(error);
    }
  }
  async sendsms(data: any) {
    try {
      const response = await fetch('https://sms.cmctelecom.vn/SMS_CMCTelecom/api/sms/sendutf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return error;
    }
  }

  async sendzns(data: any) {
    const Chinhanh: any = await this._ChinhanhService.findbyidVttech(data.BranchID)
    try {
      if (!Chinhanh?.ZaloOaToken?.access_token) {
        const logger ={
          Title:'Vttech ZNS Thanh Toán',
          Slug:'vttechznsthanhtoan',
          Action:'error',
          Mota:`[ZNS_THANHTOAN] - ${data.BranchID} - ${Chinhanh?.Title} - Chưa Có Token - ${moment().format('HH:mm:ss DD/MM/YYYY')}`}
        this._LoggerService.create(logger)
        data.Status = 3;
        this.update(data.id, data)
      }
      else {
        if(data.Congty=="tazaskin")
        {
          const priceProperty = Chinhanh.TemplateThanhtoan == '301891' || Chinhanh.TemplateThanhtoan == '302259' ? 'price' : 'cost';
          const requestData = {
           // mode: "development",
            phone: convertPhoneNum(data.CustPhone),
            template_id: Chinhanh.TemplateThanhtoan,
            template_data: {
              order_code: data.Code,
              note: moment(data.Created).format('DD/MM/YYYY'),
              [priceProperty]: parseFloat(data.Paid).toFixed(0),
              customer_name: data.CustName,
            },
            tracking_id: data.CustPhone||data.CustName||GenId(12, true),
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
            data.Status = 9;
            data.ZNSData.status = 'error';
            data.ZNSData.code = response.statusText;
            this.update(data.id, data)
            throw new Error(`Error fetching data: ${response.statusText}`);
          }
          const result = await response.json();
          const logger ={
            Title:'Vttech ZNS Thanh Toán',
            Slug:'vttechznsthanhtoan',
            Action:'error',
            Mota:`[ZNS_THANHTOAN] - ${JSON.stringify(result)} - ${DescErrorZalo(result.error)} - ${Chinhanh.Title} - ${data.CustName} - ${data.CustPhone} - ${data.Code} - ${data.Paid} - ${moment().format('HH:mm:ss DD/MM/YYYY')}`}
         this._LoggerService.create(logger)

         if (result.error == 0) {
            data.Status = 1;
            data.message_id =result.data.message_id;
            data.trackingId =requestData.tracking_id;
            data.ZNSData.status = 'success';
            data.ZNSData.code = result.error;
            data.ZNSData.message_id = result.data.message_id;
            data.ZNSData.trackingId = requestData.tracking_id;
            this.update(data.id, data)
          }

          else {
            data.Status = 2;
            data.Statuscode = result.error;
            const resultsms = await this.sendsms({
              "Brandname": "TAZA",
              "Message": `${data.CustName} da thanh toan so tien ${data.Paid} co ma hoa don la ${data.Code}. Taza cam on quy khach`,
              "Phonenumber": data.CustPhone,
              "user": "ctytaza2",
              "pass": "$2a$10$QjKAPJ9qq.RuS3jfUID2FeuGdpuSL1Rl9ugQUvy.O5PuKSlp8z95S",
              "messageId": data.CustPhone + (new Date()).getTime()
            })
            console.error(resultsms);
            data.SMSCode = resultsms.data.status;
            data.messageId =resultsms.data.messageId;
            data.SMSData = resultsms.data
            this.update(data.id, data)
          }

          return result
          // }
         }
         else if(data.Congty="Timona")
         {
              const requestData = {
               // mode: "development",
                phone: convertPhoneNum(data.CustPhone),
                template_id: Chinhanh.TemplateThanhtoan,
                template_data: {
                  order_code: data.Code,
                  date: moment(data.Created).format('DD/MM/YYYY'),
                  cost: parseFloat(data.Paid).toFixed(0),
                  student_name: data.CustName,
                },
                tracking_id: data.CustPhone||data.CustName||GenId(12, true),
              };
              const config = {
                method: 'post',
                headers: {
                  'access_token': Chinhanh.ZaloOaToken.access_token,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
              };
              const response = await fetch(`https://business.openapi.zalo.me/message/template`, config);
              if (!response.ok) {
                data.Status = 9;
                data.ZNSData.status = 'error';
                data.ZNSData.code = response.statusText;
                this.update(data.id, data)
                throw new Error(`Error fetching data: ${response.statusText}`);
              }
              const result = await response.json();
              const logger ={
                Title:'Vttech ZNS Thanh Toán',
                Slug:'vttechznsthanhtoan',
                Action:'error',
                Mota:`[ZNS_THANHTOAN] - ${JSON.stringify(result)} - ${DescErrorZalo(result.error)} - ${Chinhanh.Title} - ${data.CustName} - ${data.CustPhone} - ${data.Code} - ${data.Paid} - ${moment().format('HH:mm:ss DD/MM/YYYY')}`}
             this._LoggerService.create(logger)

             if (result.error == 0) {
                data.Status = 1;
                data.message_id =result.data.message_id;
                data.trackingId =requestData.tracking_id;
                data.ZNSData.status = 'success';
                data.ZNSData.code = result.error;
                data.ZNSData.message_id = result.data.message_id;
                data.ZNSData.trackingId = requestData.tracking_id;
                this.update(data.id, data)
              }

              else {
                data.Status = 2;
                data.Statuscode = result.error;
                const resultsms = await this.sendsms({
                  "Brandname": "TIMONA",
                  "Message": `Cam on quy khach ${data.CustName} da thanh toan so tien ${data.Paid} co ma hoa don la ${data.Code}. TIMONA cam on quy khach`,
                  "Phonenumber": data.CustPhone,
                  "user": "ctytimona2",
                  "pass": "$2a$10$/DpS3IgI1AmG0gmwXmqPLOnmaCzKVh1h.BUZ6Td4ZVEl29O7zWgbu",
                  "messageId": data.CustPhone + (new Date()).getTime()
                })
                data.SMSCode = resultsms.data.status;
                data.messageId =resultsms.data.messageId;
                data.SMSData = resultsms.data
                this.update(data.id, data)
              }

              return result
         }
      }


    } catch (error) {
      const logger ={
        Title:'Vttech ZNS Thanh Toán',
        Slug:'vttechznsthanhtoan',
        Action:'send',
        Mota:`[ZNS_THANHTOAN] - Mã Lỗi 3:  ${JSON.stringify(error)}`}
     this._LoggerService.create(logger)
    }


  }
  async sendznsauto(data: any) {
    data.CreatedBegin?data.CreatedBegin = data.CreatedBegin:moment().format('YYYY-MM-DD');
    data.createdEnd?data.createdEnd = data.createdEnd:moment().format('YYYY-MM-DD');
    data.Status?data.Status = data.Status:0;
    const result = await this.findQuery(data)
    return result

  }
  async create(data: any) {
    const check = await this.findSHD(data)
    if (!check) {
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
        CustPhone: data.CustPhone,
        CustCode: data.CustCode,
        Code:data.Code
      },
    });
  }
  async findslug(Code: any) {
    // return await this.ZnsthanhtoanRepository.findOne({
    //   where: { Code: Code },
    // });
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
    const queryBuilder = this.ZnsthanhtoanRepository.createQueryBuilder('znsthanhtoan');
    if (params.hasOwnProperty('CreatedBegin') && params.hasOwnProperty('CreatedEnd')) {
      console.error(moment(params.CreatedBegin).isSame(moment(params.CreatedEnd)));
      if(moment(params.CreatedBegin).isSame(moment(params.CreatedEnd)))
        {
          queryBuilder.andWhere('znsthanhtoan.Created = :startDate', {
            startDate: moment(params.CreatedBegin).format('YYYY-MM-DD')
          });
        }
        else {
          queryBuilder.andWhere('znsthanhtoan.Created BETWEEN :startDate AND :endDate', {
            startDate:  moment(params.CreatedBegin).format('YYYY-MM-DD'),
            endDate:  moment(params.CreatedEnd).format('YYYY-MM-DD')
          });
        }

    }
    if (params.hasOwnProperty('Title')) {
      queryBuilder.andWhere('znsthanhtoan.Title LIKE :Title', { SDT: `%${params.Title}%` });
    }
    if (params.hasOwnProperty('Status')) {
      queryBuilder.andWhere('znsthanhtoan.Status = :Status', { Status: `${params.Status}` });
    }
    if (params.hasOwnProperty('BranchID')) {
      queryBuilder.andWhere('znsthanhtoan.BranchID = :BranchID', { BranchID: `${params.BranchID}` });
    }
    const [items, totalCount] = await queryBuilder
      .limit(params.pageSize || 10) // Set a default page size if not provided
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();
    // console.error(items, totalCount);
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
