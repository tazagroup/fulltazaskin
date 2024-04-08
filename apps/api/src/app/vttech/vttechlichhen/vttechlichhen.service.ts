import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { VttechlichhenEntity } from './entities/vttechlichhen.entity';
@Injectable()
export class VttechlichhenService {
  constructor(
    @InjectRepository(VttechlichhenEntity)
    private VttechlichhenRepository: Repository<VttechlichhenEntity>
  ) { }
  async create(data: any) {
    const check = await this.findSDT(data)
    if(!check) {
      this.VttechlichhenRepository.create(data);
      return await this.VttechlichhenRepository.save(data);
    }
    else {
      return { error: 1001, data: "Trùng Dữ Liệu" }
    }

  }

  async findAll() {
    return await this.VttechlichhenRepository.find();
  }
  async findid(id: string) {
    return await this.VttechlichhenRepository.findOne({ where: { id: id } });
  }
  async findSDT(data: any) {
    return await this.VttechlichhenRepository.findOne({
      where: {
        SDT: data.SDT,
        Code: data.Code,
        Type: data.Type,
      },
    });
  }
  async findslug(SDT: any) {
    return await this.VttechlichhenRepository.findOne({
      where: { SDT: SDT },
    });
  }
  async findAllslug(SDT: any) {
    return await this.VttechlichhenRepository.find({
      where: { SDT: SDT },
    });
  }
  async findPagination(page: number, perPage: number) {
    const skip = (page - 1) * perPage;
    const totalItems = await this.VttechlichhenRepository.count();
    const vttechlichhens = await this.VttechlichhenRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: vttechlichhens,
    };
  }
  async findQuery(params: any) {
    console.error(params);
    const queryBuilder = this.VttechlichhenRepository.createQueryBuilder('vttechlichhen');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('vttechlichhen.CreateAt BETWEEN :startDate AND :endDate', {
        startDate: params.Batdau,
        endDate: params.Ketthuc,
      });
    }
    if (params.Title) {
      queryBuilder.andWhere('vttechlichhen.Title LIKE :Title', { SDT: `%${params.Title}%` });
    }
    const [items, totalCount] = await queryBuilder
      .limit(params.pageSize || 10) // Set a default page size if not provided
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();
    console.log(items, totalCount);

    return { items, totalCount };
  }
  async update(id: string, UpdateVttechlichhenDto: any) {
    this.VttechlichhenRepository.save(UpdateVttechlichhenDto);
    return await this.VttechlichhenRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.VttechlichhenRepository.delete(id);
    return { deleted: true };
  }
}
