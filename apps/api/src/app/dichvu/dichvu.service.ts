import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateDichvuDto } from './dto/create-dichvu.dto';
import { UpdateDichvuDto } from './dto/update-dichvu.dto';
import { DichvuEntity } from './entities/dichvu.entity';
@Injectable()
export class DichvuService {
  constructor(
    @InjectRepository(DichvuEntity)
    private DichvuRepository: Repository<DichvuEntity>
  ) {}
  async create(CreateDichvuDto: CreateDichvuDto) {
    this.DichvuRepository.create(CreateDichvuDto);
    return await this.DichvuRepository.save(CreateDichvuDto);
  }

  async findAll() {
    return await this.DichvuRepository.find();
  }
  async findid(id: string) {
    return await this.DichvuRepository.findOne({
      where: { id: id },
    });
  }
  async findbyDM(id: string) {
    return await this.DichvuRepository.find({
      where: { idDM: id },
    });
  }
  async findNoibat() {
    return await this.DichvuRepository.find({where: { Noibat: true }});
  }
  async findslug(slug: any) {
    return await this.DichvuRepository.findOne({
      where: { Slug: slug},
    });
  }
  async findPagination(page: number, perPage: number){
    const skip = (page - 1) * perPage;
    const totalItems = await this.DichvuRepository.count();
    const dichvus = await this.DichvuRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: dichvus,
    };
  }
  async findQuery(query: string){
    return await this.DichvuRepository.find({
      where: { Title: Like(`%${query}%`) },
    });
  }
  async search(params: any){
      console.error(params);
      const queryBuilder = this.DichvuRepository.createQueryBuilder('dichvu');
      if (params.Batdau && params.Ketthuc) {
        queryBuilder.andWhere('dichvu.CreateAt BETWEEN :startDate AND :endDate', {
          startDate: params.Batdau,
          endDate: params.Ketthuc,
        });
      }
      if (params.MaDichvu) {
        queryBuilder.andWhere('dichvu.MaDichvu = :MaDichvu', { MaDichvu: `${params.MaDichvu}` });
      }
      if (params.hasOwnProperty('isDelete')) {
        queryBuilder.andWhere('dichvu.isDelete = :isDelete', { isDelete: `${params.isDelete}` });
      }
      let [item, totalCount]:any = await queryBuilder
        .limit(params.pageSize || 10) // Set a default page size if not provided
        .offset(params.pageNumber * params.pageSize || 0)
        .getManyAndCount();
        // const items = await Promise.all(
        //   item.map(async (v: any) => {
        //     v.Giohangs = await this._GiohangService.findid(v.idGiohang);
        //     v.Khachhang = await this._KhachhangService.findid(v.idKH);
        //     return v; 
        //   })
        // );         
      return { item, totalCount };
  }

  async update(id: string, UpdateDichvuDto: UpdateDichvuDto) {
    this.DichvuRepository.save(UpdateDichvuDto);
    return await this.DichvuRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
   // console.error(id)
    await this.DichvuRepository.delete(id);
    return { deleted: true };
  }
}
