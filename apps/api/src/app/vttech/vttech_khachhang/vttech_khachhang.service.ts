import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Vttech_khachhangEntity } from './entities/vttech_khachhang.entity';
@Injectable()
export class Vttech_khachhangService {
  constructor(
    @InjectRepository(Vttech_khachhangEntity)
    private Vttech_khachhangRepository: Repository<Vttech_khachhangEntity>
  ) {}

  async create(CreateVttech_khachhangDto: any) {
    this.Vttech_khachhangRepository.create(CreateVttech_khachhangDto);
    return await this.Vttech_khachhangRepository.save(CreateVttech_khachhangDto);
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
    console.error(params);
    const queryBuilder = this.Vttech_khachhangRepository.createQueryBuilder('vttechthanhtoan');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('vttechthanhtoan.CreateAt BETWEEN :startDate AND :endDate', {
        startDate:params.Batdau,
        endDate:params.Ketthuc,
      });
    }
    if (params.SDT) {
      queryBuilder.andWhere('vttechthanhtoan.SDT LIKE :SDT', { SDT: `%${params.SDT}%` });
    }
    const [items, totalCount] = await queryBuilder
    .limit(params.pageSize || 10) // Set a default page size if not provided
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
