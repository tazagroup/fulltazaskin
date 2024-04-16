import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateVttechlieutrinhDto } from './dto/create-vttechlieutrinh.dto';
import { UpdateVttechlieutrinhDto } from './dto/update-vttechlieutrinh.dto';
import { VttechlieutrinhEntity } from './entities/vttechlieutrinh.entity';
@Injectable()
export class VttechlieutrinhService {
  constructor(
    @InjectRepository(VttechlieutrinhEntity)
    private VttechlieutrinhRepository: Repository<VttechlieutrinhEntity>
  ) { }
  async create(data: any) {
    const check = await this.findslug(data)
    if(!check) {
      this.VttechlieutrinhRepository.create(data);
      return await this.VttechlieutrinhRepository.save(data);
    }
    else {
      return { error: 1001, data: "Trùng Dữ Liệu" }
    }

  }

  async findAll() {
    return await this.VttechlieutrinhRepository.find();
  }
  async findid(id: string) {
    return await this.VttechlieutrinhRepository.findOne({ where: { id: id } });
  }
  async findSHD(data: any) {
    return await this.VttechlieutrinhRepository.findOne({
      where: {
        IDLieutrinh: data.IDLieutrinh,
        Type: data.Type
      },
    });
  }
  async findslug(IDLieutrinh: any) {
    return await this.VttechlieutrinhRepository.findOne({
      where: { IDLieutrinh: IDLieutrinh },
    });
  }
  async findAllslug(IDLieutrinh: any) {
    return await this.VttechlieutrinhRepository.find({
      where: { IDLieutrinh: IDLieutrinh },
    });
  }
  async findPagination(page: number, perPage: number) {
    const skip = (page - 1) * perPage;
    const totalItems = await this.VttechlieutrinhRepository.count();
    const vttechlieutrinhs = await this.VttechlieutrinhRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: vttechlieutrinhs,
    };
  }
  async findQuery(params: any) {
    console.error(params);
    const queryBuilder = this.VttechlieutrinhRepository.createQueryBuilder('vttechlieutrinh');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('vttechlieutrinh.CreateAt BETWEEN :startDate AND :endDate', {
        startDate: params.Batdau,
        endDate: params.Ketthuc,
      });
    }
    if (params.Title) {
      queryBuilder.andWhere('vttechlieutrinh.Title LIKE :Title', { SDT: `%${params.Title}%` });
    }
    const [items, totalCount] = await queryBuilder
      .limit(params.pageSize || 10) // Set a default page size if not provided
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();
    console.log(items, totalCount);

    return { items, totalCount };
  }
  async update(id: string, UpdateVttechlieutrinhDto: UpdateVttechlieutrinhDto) {
    this.VttechlieutrinhRepository.save(UpdateVttechlieutrinhDto);
    return await this.VttechlieutrinhRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.VttechlieutrinhRepository.delete(id);
    return { deleted: true };
  }
}
