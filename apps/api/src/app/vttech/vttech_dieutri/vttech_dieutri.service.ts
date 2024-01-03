import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Vttech_dieutriEntity } from './entities/vttech_dieutri.entity';
@Injectable()
export class Vttech_dieutriService {
  constructor(
    @InjectRepository(Vttech_dieutriEntity)
    private Vttech_dieutriRepository: Repository<Vttech_dieutriEntity>
  ) {}
  async create(CreateVttech_dieutriDto: any) {
    this.Vttech_dieutriRepository.create(CreateVttech_dieutriDto);
    return await this.Vttech_dieutriRepository.save(CreateVttech_dieutriDto);
  }

  async findAll() {
    return await this.Vttech_dieutriRepository.find();
  }
  async findid(id: string) {
    return await this.Vttech_dieutriRepository.findOne({
      where: { id: id },

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
      queryBuilder.andWhere('vttech_dieutri.CreateAt BETWEEN :startDate AND :endDate', {
        startDate:params.Batdau,
        endDate:params.Ketthuc,
      });
    }
    if (params.Title) {
      queryBuilder.andWhere('vttech_dieutri.Title LIKE :Title', { SDT: `%${params.Title}%` });
    }
    const [items, totalCount] = await queryBuilder
    .limit(params.pageSize || 10) // Set a default page size if not provided
    .offset(params.pageNumber * params.pageSize || 0)
    .getManyAndCount();
  return { items, totalCount };
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
