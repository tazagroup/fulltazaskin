import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Like, Repository } from 'typeorm';
import { Vttech_tinhtrangphongEntity } from './entities/vttech_tinhtrangphong.entity';
@Injectable()
export class Vttech_tinhtrangphongService {
  constructor(
    @InjectRepository(Vttech_tinhtrangphongEntity)
    private Vttech_tinhtrangphongRepository: Repository<Vttech_tinhtrangphongEntity>
  ) {}
  async create(data: any) {
    this.Vttech_tinhtrangphongRepository.create(data);
    return await this.Vttech_tinhtrangphongRepository.save(data);
  }

  async findAll() {
    return await this.Vttech_tinhtrangphongRepository.find();
  }
  async fininday() {
    const now = new Date()
    const Start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const End = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      return await this.Vttech_tinhtrangphongRepository.find({
        where: {
          BeginTime: Between(Start, End),
          Status: In([0, 1]),
        },
      }); 
  }
  async findid(id: string) {
    return await this.Vttech_tinhtrangphongRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(slug: any) {
    return await this.Vttech_tinhtrangphongRepository.findOne({
      where: { Slug: slug},
    });
  }
  async findPagination(page: number, perPage: number){
    const skip = (page - 1) * perPage;
    const totalItems = await this.Vttech_tinhtrangphongRepository.count();
    const vttech_tinhtrangphongs = await this.Vttech_tinhtrangphongRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: vttech_tinhtrangphongs,
    };
  }
  async findQuery(params: any) {
    console.error(params);
    const queryBuilder = this.Vttech_tinhtrangphongRepository.createQueryBuilder('vttech_tinhtrangphong');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('vttech_tinhtrangphong.BeginTime BETWEEN :startDate AND :endDate', {
        startDate:params.Batdau,
        endDate:params.Ketthuc,
      });
    }
    if (params.Title) {
      queryBuilder.andWhere('vttech_tinhtrangphong.Title LIKE :Title', { SDT: `%${params.Title}%` });
    }
    const [items, totalCount] = await queryBuilder
    .limit(params.pageSize || 10) // Set a default page size if not provided
    .offset(params.pageNumber * params.pageSize || 0)
    .getManyAndCount();
  return { items, totalCount };
  }
  async update(id: string, UpdateVttech_tinhtrangphongDto: any) {
    this.Vttech_tinhtrangphongRepository.save(UpdateVttech_tinhtrangphongDto);
    return await this.Vttech_tinhtrangphongRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.Vttech_tinhtrangphongRepository.delete(id);
    return { deleted: true };
  }
}
