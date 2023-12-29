import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Vttech_khachhangEntity } from './entities/vttech_khachhang.entity';
//import { CauhinhchungService } from '../../cauhinh/cauhinhchung/cauhinhchung.service';
@Injectable()
export class Vttech_khachhangService {
  Cookie: any = ''
  XsrfToken: any = ''
  constructor(
    @InjectRepository(Vttech_khachhangEntity)
    private Vttech_khachhangRepository: Repository<Vttech_khachhangEntity>,
    // private _CauhinhchungService: CauhinhchungService,
    )  {
      // this._CauhinhchungService.findslug('vttechtoken').then((data: any) => {
      //   this.Cookie = data.Content.Cookie
      //   this.XsrfToken = data.Content.XsrfToken
      // })
    }

  async create(CreateVttech_khachhangDto: any) {
    this.Vttech_khachhangRepository.create(CreateVttech_khachhangDto);
    return await this.Vttech_khachhangRepository.save(CreateVttech_khachhangDto);
  }
  async GetGeneralInfo(CustomerID: any) {
    const axios = require('axios');

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://tmtaza.vttechsolution.com/Customer/GeneralInfo/?handler=Loadata&CustomerID=${CustomerID}`,
      headers: { Cookie: this.Cookie, 'Xsrf-Token': this.XsrfToken },
    };
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
    
  }

  async findAll() {
    return await this.Vttech_khachhangRepository.find();
  }
  async findid(id: string) {
    return await this.Vttech_khachhangRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(slug: any) {
    return await this.Vttech_khachhangRepository.findOne({
      where: { Hoten: slug},
    });
  }
  async findPagination(page: number, perPage: number){
    const skip = (page - 1) * perPage;
    const totalItems = await this.Vttech_khachhangRepository.count();
    const vttech_khachhangs = await this.Vttech_khachhangRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: vttech_khachhangs,
    };
  }
  async findQuery(params: any) {
    const queryBuilder = this.Vttech_khachhangRepository.createQueryBuilder('vttech_khachhang');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('vttech_khachhang.CreateAt BETWEEN :startDate AND :endDate', {
        startDate:params.Batdau,
        endDate:params.Ketthuc,
      });
    }
    if (params.SDT) {
      queryBuilder.andWhere('vttech_khachhang.SDT LIKE :SDT', { SDT: `%${params.SDT}%` });
    }
    if (params.Hoten) {
      queryBuilder.andWhere('vttech_khachhang.Hoten LIKE :Hoten', { Hoten: `%${params.Hoten}%` });
    }
    if (params.idCN) {
      queryBuilder.andWhere('vttech_khachhang.idCN LIKE :idCN', { idCN: `${params.idCN}` });
    }
    const [items, totalCount] = await queryBuilder
    .limit(params.pageSize || 10)
    .offset(params.pageNumber * params.pageSize || 0)
    .getManyAndCount();
  return { items, totalCount };
  }
  async update(id: string, UpdateVttech_khachhangDto: any) {
    this.Vttech_khachhangRepository.save(UpdateVttech_khachhangDto);
    return await this.Vttech_khachhangRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.Vttech_khachhangRepository.delete(id);
    return { deleted: true };
  }
}
