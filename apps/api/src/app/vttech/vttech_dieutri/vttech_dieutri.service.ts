import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Like, Repository } from 'typeorm';
import { Vttech_dieutriEntity } from './entities/vttech_dieutri.entity';
import { CauhinhchungService } from '../../cauhinh/cauhinhchung/cauhinhchung.service';
import moment = require('moment');
import { LIST_CHI_NHANH } from '../../shared.utils';
import { ZaloznsService } from '../../zalo/zalozns/zalozns.service';
import { LoggerService } from '../../logger/logger.service';
const axios = require('axios');
@Injectable()
export class Vttech_dieutriService {
  Cookie: any = ''
  XsrfToken: any = ''
  constructor(
    @InjectRepository(Vttech_dieutriEntity)
    private Vttech_dieutriRepository: Repository<Vttech_dieutriEntity>,
    private _CauhinhchungService: CauhinhchungService,
    private _ZaloznsService: ZaloznsService,
    private _LoggerService: LoggerService,
  ) {
    this._CauhinhchungService.findslug('vttechtoken').then((data: any) => {
      this.Cookie = data.Content.Cookie
      this.XsrfToken = data.Content.XsrfToken
    })
  }

  async GetDieutriVttech(idVttech: any, data: any = {}) {
    let begin: any
    let end: any
    if (Object.entries(data).length > 0) {
      begin = moment(new Date(data.begin))
      end = moment(new Date(data.end))
    }
    else {
      begin = moment()
      end = moment()
    }
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://tmtaza.vttechsolution.com/Report/Treatment/DRTreatmentGen/?handler=LoadataDetailCust&branchID=${idVttech}&dateFrom=${begin.format('DD-MM-YYYY')}&dateTo=${end.format('DD-MM-YYYY')}`,
      headers: {
        'Cookie': this.Cookie,
        'Xsrf-Token': this.XsrfToken
      }
    };
    return axios.request(config)
      .then((response: any) => {
        response.data.forEach(async (v: any) => {
          const result = await this.GetKhachhangbyCode(v.CustCode)
          let item: any = {}
          item.CustName = v.CustName
          item.CustCode = v.CustCode
          item.checkTime = (new Date(begin)).getTime()
          item.NgayVttech = begin.format('YYYY-MM-DD')
          item.SDT = result.Table[0].CustomerPhone
          item.SDT2 = result.Table[0].CustomerPhone2
          item.idVttech = idVttech
          const Ketqua = await this.create(item)
           const logger = {
          Title: 'Điều Trị',
          Slug: 'dieutri',
          Action: 'addnew',
          Mota: `Thêm Mới Điều Trị Từ Vttech ${JSON.stringify(Ketqua)}`
        }
        this._LoggerService.create(logger)
        });
      })
      .catch((error: any) => {
        console.log(error);
      });

  }
  async SendZNSAuto()
  {
    const ListDieutri = await this.fininday()

    ListDieutri.forEach((v)=>
    {
      if(this.CheckTime())
      {
        this.SendCamon(v)
      }
    })
  }
  async GetKhachhangbyCode(code: any) {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://tmtaza.vttechsolution.com/Searching/Searching/?handler=SearchByOption&data=[{"name":"CUST_CODE","value":"${code}"}]`,
      headers: {
        'Cookie': this.Cookie,
        'Xsrf-Token': this.XsrfToken
      }
    };
    return axios.request(config)
      .then((response: any) => {
        return response.data
      })
      .catch((error: any) => {
        console.log(error);
      });

  }

  async create(data: any) {
    const check = await this.findbyCustCode(data)
    if (check) {
      return { error: 1001, data: "Trùng Dữ Liệu" }
    }
    else {
      this.Vttech_dieutriRepository.create(data);
      return await this.Vttech_dieutriRepository.save(data);
    }

  }

  async findAll() {
    return await this.Vttech_dieutriRepository.find();
  }
  async fininday() {
    const Start = moment().startOf('date').toDate()
    const End = moment().endOf('date').toDate()
    return await this.Vttech_dieutriRepository.find({
      where: {
        CreateAt: Between(Start, End),
        Status:0,
      },
    });
  }
  async findid(id: string) {
    return await this.Vttech_dieutriRepository.findOne({
      where: { id: id },

    });
  }
  async findbyCustCode(data: any) {
    return await this.Vttech_dieutriRepository.findOne({
      where: {
        CustCode: data.CustCode,
        NgayVttech: data.NgayVttech
      },
    });
  }
  async UpdateDieutri(CustCode: any, Status: any) {
    // const Invoices = await this.findbyCustCode(CustCode)
    // Invoices.forEach((v: any) => {
    //   v.Status = Status
    //   this.update(v.id, v)
    // });
  }
  async findslug(slug: any) {
    return await this.Vttech_dieutriRepository.findOne({
      // where: { Slug: slug },
    });
  }
  async findPagination(page: number, perPage: number) {
    const skip = (page - 1) * perPage;
    const totalItems = await this.Vttech_dieutriRepository.count();
    const vttech_dieutris = await this.Vttech_dieutriRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: vttech_dieutris,
    };
  }
  async findQuery(params: any) {
    const queryBuilder = this.Vttech_dieutriRepository.createQueryBuilder('vttech_dieutri');
    const queryBuilder1 = this.Vttech_dieutriRepository.createQueryBuilder('vttech_dieutri');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('vttech_dieutri.checkTime BETWEEN :startDate AND :endDate', {
        startDate: (new Date(params.Batdau)).getTime(),
        endDate: (new Date(params.Ketthuc)).getTime(),
      });
      queryBuilder1.andWhere('vttech_dieutri.checkTime BETWEEN :startDate AND :endDate', {
        startDate: (new Date(params.Batdau)).getTime(),
        endDate: (new Date(params.Ketthuc)).getTime(),
      });
    }
    if (params.SDT) {
      queryBuilder.andWhere('vttech_dieutri.SDT LIKE :SDT', { SDT: `%${params.SDT}%` });
    }
    if (params.hasOwnProperty("Status")) {
      queryBuilder.andWhere('vttech_dieutri.Status LIKE :Status', { Status: `${params.Status}` });
    }
    if (params.hasOwnProperty("BranchID") && params.BranchID != 0) {
      queryBuilder.andWhere('vttech_dieutri.idVttech = :idVttech', { idVttech: `${params.BranchID}` });
      queryBuilder1.andWhere('vttech_dieutri.idVttech = :idVttech', { idVttech: `${params.BranchID}` });
    }
    const [items, totalCount] = await queryBuilder
      .limit(params.pageSize || 10)
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();

    const [result] = await queryBuilder1.getManyAndCount();
    const ListStatus = result.map((v: any) => ({ Status: v.Status }))

    return { items, totalCount, ListStatus };
  }

  async SendCamon(data: any) {
    const CheckData = await this.findid(data.id)    
    if (CheckData.Status == 0 ||CheckData.Status == 1) {
      const now = moment();
      const compareTime = moment(data.CreateAt).add(3, 'hours');
      if (now.isAfter(compareTime)) {
        const Chinhanh = LIST_CHI_NHANH.find((v: any) => v.idVttech == data.idVttech)
        if (Chinhanh) {
          try {
            this._ZaloznsService.TemplateDanhgia(data, Chinhanh).then((zns: any) => {
              if (zns) {
                data.SendZNSAt = new Date()
                data.Status = 2
                this.update(data.id, data)
                const logger = {
                  Title: 'Điều Trị',
                  Slug: 'dieutri',
                  Action: 'done',
                  Mota: `${zns.Title}`
                }
                this._LoggerService.create(logger)
              }
              else {
                data.SendZNSAt = new Date()
                data.Status = 5
                this.update(data.id, data)
                const logger = {
                  Title: 'Điều Trị',
                  Slug: 'dieutri',
                  Action: 'khac',
                  Mota: `${JSON.stringify(zns)}`
                }
                this._LoggerService.create(logger)
              }
            })
          } catch (error) {
            console.error(`Error calling Zalozns service: ${error.message}`);
          }
          // data.Status = 1
          // this.update(data.id, 1)
          // const logger = {
          //   Title: 'Điều Trị',
          //   Slug: 'dieutri',
          //   Action: 'waiting',
          //   Mota: `Điều Trị: ${data.CustName} - ${data.SDT} - ${moment().format("HH:mm:ss DD/MM/YYYY")}`
          // }
          // this._LoggerService.create(logger)
        }
        else {
          data.Status = 3
          this.update(data.id, data)
          const logger = {
            Title: 'Điều Trị',
            Slug: 'dieutri',
            Action: 'error',
            Mota: `Chi nhánh chưa đăng ký ZNS`
          }
          this._LoggerService.create(logger)
        }
        return data
      }
    }
  }



  CheckTime() {
    const now = moment();
    const checkTime = now.hour() >= 8 && now.hour() <= 19;
    return checkTime
  }
  async update(id: string, UpdateVttech_dieutriDto: any) {
    this.Vttech_dieutriRepository.save(UpdateVttech_dieutriDto);
    return await this.Vttech_dieutriRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    await this.Vttech_dieutriRepository.delete(id);
    return { deleted: true };
  }
}
