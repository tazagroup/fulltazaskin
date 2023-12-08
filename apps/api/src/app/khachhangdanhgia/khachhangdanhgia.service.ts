import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateKhachhangdanhgiaDto } from './dto/create-khachhangdanhgia.dto';
import { UpdateKhachhangdanhgiaDto } from './dto/update-khachhangdanhgia.dto';
import { KhachhangdanhgiaEntity } from './entities/khachhangdanhgia.entity';
@Injectable()
export class KhachhangdanhgiaService {
  constructor(
    @InjectRepository(KhachhangdanhgiaEntity)
    private KhachhangdanhgiaRepository: Repository<KhachhangdanhgiaEntity>
  ) {}
  async create(CreateKhachhangdanhgiaDto: CreateKhachhangdanhgiaDto) {
    this.KhachhangdanhgiaRepository.create(CreateKhachhangdanhgiaDto);
    return await this.KhachhangdanhgiaRepository.save(CreateKhachhangdanhgiaDto);
  }

  async findAll() {
    return await this.KhachhangdanhgiaRepository.find();
  }
  async findid(id: string) {
    return await this.KhachhangdanhgiaRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(slug: any) {
    return await this.KhachhangdanhgiaRepository.findOne({
      where: { Slug: slug},
    });
  }
  async findPagination(page: number, perPage: number){
    const skip = (page - 1) * perPage;
    const totalItems = await this.KhachhangdanhgiaRepository.count();
    const khachhangdanhgias = await this.KhachhangdanhgiaRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: khachhangdanhgias,
    };
  }
  async findQuery(query: string){
    return await this.KhachhangdanhgiaRepository.find({
      where: { Title: Like(`%query%`) },
    });
  }
  async update(id: string, UpdateKhachhangdanhgiaDto: UpdateKhachhangdanhgiaDto) {
    this.KhachhangdanhgiaRepository.save(UpdateKhachhangdanhgiaDto);
    return await this.KhachhangdanhgiaRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.KhachhangdanhgiaRepository.delete(id);
    return { deleted: true };
  }
}
