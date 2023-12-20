import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateKhachhangdichvuDto } from './dto/create-khachhangdichvu.dto';
import { UpdateKhachhangdichvuDto } from './dto/update-khachhangdichvu.dto';
import { KhachhangdichvuEntity } from './entities/khachhangdichvu.entity';
@Injectable()
export class KhachhangdichvuService {
  constructor(
    @InjectRepository(KhachhangdichvuEntity)
    private KhachhangdichvuRepository: Repository<KhachhangdichvuEntity>
  ) {}
  async create(CreateKhachhangdichvuDto: CreateKhachhangdichvuDto) {
    this.KhachhangdichvuRepository.create(CreateKhachhangdichvuDto);
    return await this.KhachhangdichvuRepository.save(CreateKhachhangdichvuDto);
  }

  async findAll() {
    return await this.KhachhangdichvuRepository.find();
  }
  async findid(id: string) {
    return await this.KhachhangdichvuRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(slug: any) {
    return await this.KhachhangdichvuRepository.findOne({
      where: { Slug: slug},
    });
  }
  async findPagination(page: number, perPage: number){
    const skip = (page - 1) * perPage;
    const totalItems = await this.KhachhangdichvuRepository.count();
    const khachhangdichvus = await this.KhachhangdichvuRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: khachhangdichvus,
    };
  }
  async findQuery(query: string){
    return await this.KhachhangdichvuRepository.find({
      where: { Title: Like(`%query%`) },
    });
  }
  async update(id: string, UpdateKhachhangdichvuDto: UpdateKhachhangdichvuDto) {
    this.KhachhangdichvuRepository.save(UpdateKhachhangdichvuDto);
    return await this.KhachhangdichvuRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.KhachhangdichvuRepository.delete(id);
    return { deleted: true };
  }
}
