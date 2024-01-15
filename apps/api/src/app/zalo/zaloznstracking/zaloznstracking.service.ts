import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateZaloznstrackingDto } from './dto/create-zaloznstracking.dto';
import { UpdateZaloznstrackingDto } from './dto/update-zaloznstracking.dto';
import { ZaloznstrackingEntity } from './entities/zaloznstracking.entity';
import Zaloznstracking from './zaloznstracking';
@Injectable()
export class ZaloznstrackingService {
  constructor(
    @InjectRepository(ZaloznstrackingEntity)
    private ZaloznstrackingRepository: Repository<ZaloznstrackingEntity>
  ) {}
  async create(data: Zaloznstracking) {
    const Check = await this.findslug(data.msg_id)
    if(Check)
    {
      return {error:1001,data:'Trùng Dữ Liệu'}
    }
    else
    {
      this.ZaloznstrackingRepository.create(data);
      return await this.ZaloznstrackingRepository.save(data);
    }
  }

  async findAll() {
    return await this.ZaloznstrackingRepository.find();
  }
  async findid(id: string) {
    return await this.ZaloznstrackingRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(msg_id: any) {
    return await this.ZaloznstrackingRepository.findOne({
      where: { msg_id: msg_id},
    });
  }
  async findtrackingid(tracking_id: any) {
    return await this.ZaloznstrackingRepository.findOne({
      where: { tracking_id: tracking_id},
    });
  }
  async findPagination(page: number, perPage: number){
    const skip = (page - 1) * perPage;
    const totalItems = await this.ZaloznstrackingRepository.count();
    const zaloznstrackings = await this.ZaloznstrackingRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: zaloznstrackings,
    };
  }
  async findQuery(params: any) {
    console.error(params);
    const queryBuilder = this.ZaloznstrackingRepository.createQueryBuilder('zaloznstracking');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('zaloznstracking.CreateAt BETWEEN :startDate AND :endDate', {
        startDate:params.Batdau,
        endDate:params.Ketthuc,
      });
    }
    if (params.Title) {
      queryBuilder.andWhere('zaloznstracking.Title LIKE :Title', { SDT: `%${params.Title}%` });
    }
    const [items, totalCount] = await queryBuilder
    .limit(params.pageSize || 10) // Set a default page size if not provided
    .offset(params.pageNumber * params.pageSize || 0)
    .getManyAndCount();
  return { items, totalCount };
  }
  async update(id: string, UpdateZaloznstrackingDto: UpdateZaloznstrackingDto) {
    this.ZaloznstrackingRepository.save(UpdateZaloznstrackingDto);
    return await this.ZaloznstrackingRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.ZaloznstrackingRepository.delete(id);
    return { deleted: true };
  }
}
