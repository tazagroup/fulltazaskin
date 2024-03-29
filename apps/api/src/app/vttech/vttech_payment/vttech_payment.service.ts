import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { VttechpaymentEntity } from './entities/vttech_payment.entity';
@Injectable()
export class VttechpaymentService {
  constructor(
    @InjectRepository(VttechpaymentEntity)
    private VttechpaymentRepository: Repository<VttechpaymentEntity>
  ) { }
  async create(data: any) {
    const check = await this.findSHD(data)
    if(!check) {
      this.VttechpaymentRepository.create(data);
      return await this.VttechpaymentRepository.save(data);
    }
    else {
      this.update(check.id,check)
      return { error: 1001, data: "Trùng Dữ Liệu" }
    }

  }
  async findAll() {
    return await this.VttechpaymentRepository.find();
  }
  async findid(id: string) {
    return await this.VttechpaymentRepository.findOne({ where: { id: id } });
  }
  async findSHD(data: any) {
    return await this.VttechpaymentRepository.findOne({
      where: {
        PHONE: data.SDT,
        Type: data.Type
      },
    });
  }
  async findslug(PHONE: any) {
    return await this.VttechpaymentRepository.findOne({
      where: {
        PHONE: PHONE
      },
    });
  }
  async findPagination(page: number, perPage: number) {
    const skip = (page - 1) * perPage;
    const totalItems = await this.VttechpaymentRepository.count();
    const vttechpayments = await this.VttechpaymentRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: vttechpayments,
    };
  }
  async findQuery(params: any) {
    console.error(params);
    const queryBuilder = this.VttechpaymentRepository.createQueryBuilder('vttechpayment');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('vttechpayment.CreateAt BETWEEN :startDate AND :endDate', {
        startDate: params.Batdau,
        endDate: params.Ketthuc,
      });
    }
    if (params.Title) {
      queryBuilder.andWhere('vttechpayment.Title LIKE :Title', { SDT: `%${params.Title}%` });
    }
    const [items, totalCount] = await queryBuilder
      .limit(params.pageSize || 10) // Set a default page size if not provided
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();
    console.log(items, totalCount);

    return { items, totalCount };
  }
  async update(id: string, data: any) {
    await this.VttechpaymentRepository.save(data);
    return await this.VttechpaymentRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.VttechpaymentRepository.delete(id);
    return { deleted: true };
  }
}
