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
  async update(id: string, UpdateDichvuDto: UpdateDichvuDto) {
    this.DichvuRepository.save(UpdateDichvuDto);
    return await this.DichvuRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.DichvuRepository.delete(id);
    return { deleted: true };
  }
}
