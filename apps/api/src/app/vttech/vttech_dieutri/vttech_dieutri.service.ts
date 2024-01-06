import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Like, Repository } from 'typeorm';
import { Vttech_dieutriEntity } from './entities/vttech_dieutri.entity';
import { start } from 'repl';
import { Vttech_dieutri_znsEntity } from './entities/vttech_dieutri_zns.entity';
@Injectable()
export class Vttech_dieutriService {
  constructor(
    @InjectRepository(Vttech_dieutriEntity)
    private Vttech_dieutriRepository: Repository<Vttech_dieutriEntity>,
    @InjectRepository(Vttech_dieutri_znsEntity)
    private Vttech_dieutri_znsRepository: Repository<Vttech_dieutri_znsEntity>
  ) {}
  async create(CreateVttech_dieutriDto: any) {
    this.Vttech_dieutriRepository.create(CreateVttech_dieutriDto);
    return await this.Vttech_dieutriRepository.save(CreateVttech_dieutriDto);
  }
  async create_zns(data: any) {
    this.Vttech_dieutri_znsRepository.create(data);
    return await this.Vttech_dieutri_znsRepository.save(data);
  }
  async update_zns(id: string, data: any) {
    this.Vttech_dieutri_znsRepository.save(data);
    return await this.Vttech_dieutri_znsRepository.findOne({ where: { id: id } });
  }
  async findQuery_zns(params: any) {
    const queryBuilder = this.Vttech_dieutri_znsRepository.createQueryBuilder('vttech_dieutri_zns');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('vttech_dieutri_zns.Created BETWEEN :startDate AND :endDate', {
        startDate: params.Batdau,
        endDate: params.Ketthuc,
      });
    }
    if (params.SDT) {
      queryBuilder.andWhere('vttech_dieutri_zns.SDT LIKE :SDT', { SDT: `%${params.SDT}%` });
    }
    if (params.hasOwnProperty("Status")) {
      queryBuilder.andWhere('vttech_dieutri_zns.Status LIKE :Status', { Status: `${params.Status}` });
    }
    const [items, totalCount] = await queryBuilder
      .limit(params.pageSize || 10)
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();

    const queryBuilder1 = this.Vttech_dieutriRepository.createQueryBuilder('vttech_dieutri');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder1.andWhere('vttech_dieutri.Created BETWEEN :startDate AND :endDate', {
        startDate: params.Batdau,
        endDate: params.Ketthuc,
      });
    }
    const [result] = await queryBuilder1.getManyAndCount();
    const ListStatus = result.map((v: any) => ({ Status: v.Status }))

    return { items, totalCount, ListStatus };
  }

  async findAll() {
    return await this.Vttech_dieutriRepository.find();
  }
  async fininday() {
    const now = new Date()
    const Start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const End = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      return await this.Vttech_dieutriRepository.find({
        where: {
          TimeZNS: Between(Start, End),
          Status: In([0, 1]),
        },
      }); 
  }
  async fininday_zns() {
    const now = new Date()
    const Start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const End = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      return await this.Vttech_dieutri_znsRepository.find({
        where: {
          TimeZNS: Between(Start, End),
          Status: In([0, 1]),
        },
      }); 
  }
  async find19h() {
    const now = new Date()
    const Start = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1, 19, 0, 0);
    const End = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
      return await this.Vttech_dieutriRepository.find({
        where: {
          Created: Between(Start, End),
          Status: In([0, 1]),
        },
      }); 
  }
  async findid(id: string) {
    return await this.Vttech_dieutriRepository.findOne({
      where: { id: id },

    });
  }
  async findbyCustCode(CustCode: string) {
    return await this.Vttech_dieutriRepository.find({
      where: { CustCode: CustCode },
    });
  }
  async UpdateDieutri(CustCode:any,Status:any)
  {
    const Invoices = await this.findbyCustCode(CustCode)
    Invoices.forEach((v:any) => {
      v.Status = Status
      this.update(v.id,v)
    });
  }
  async findslug(slug: any) {
    return await this.Vttech_dieutriRepository.findOne({
      where: { Slug: slug},
    });
  }
  async findPagination(page: number, perPage: number){
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
    console.error(params);
    const queryBuilder = this.Vttech_dieutriRepository.createQueryBuilder('vttech_dieutri');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('vttech_dieutri.Created BETWEEN :startDate AND :endDate', {
        startDate: params.Batdau,
        endDate: params.Ketthuc,
      });
    }
    if (params.SDT) {
      queryBuilder.andWhere('vttech_dieutri.SDT LIKE :SDT', { SDT: `%${params.SDT}%` });
    }
    if (params.hasOwnProperty("Status")) {
      queryBuilder.andWhere('vttech_dieutri.Status LIKE :Status', { Status: `${params.Status}` });
    }
    const [items, totalCount] = await queryBuilder
      .limit(params.pageSize || 10)
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();

    const queryBuilder1 = this.Vttech_dieutriRepository.createQueryBuilder('vttech_dieutri');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder1.andWhere('vttech_dieutri.Created BETWEEN :startDate AND :endDate', {
        startDate: params.Batdau,
        endDate: params.Ketthuc,
      });
    }
    const [result] = await queryBuilder1.getManyAndCount();
    const ListStatus = result.map((v: any) => ({ Status: v.Status }))

    return { items, totalCount, ListStatus };
  }

  async update(id: string, UpdateVttech_dieutriDto: any) {
    this.Vttech_dieutriRepository.save(UpdateVttech_dieutriDto);
    return await this.Vttech_dieutriRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.Vttech_dieutriRepository.delete(id);
    return { deleted: true };
  }
}
