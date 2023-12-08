import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateKhuyenmaiDto } from './dto/create-khuyenmai.dto';
import { UpdateKhuyenmaiDto } from './dto/update-khuyenmai.dto';
import { KhuyenmaiEntity } from './entities/khuyenmai.entity';
@Injectable()
export class KhuyenmaiService {
  constructor(
    @InjectRepository(KhuyenmaiEntity)
    private KhuyenmaiRepository: Repository<KhuyenmaiEntity>
  ) {}
  async create(CreateKhuyenmaiDto: CreateKhuyenmaiDto) {
    this.KhuyenmaiRepository.create(CreateKhuyenmaiDto);
    return await this.KhuyenmaiRepository.save(CreateKhuyenmaiDto);
  }

  async findAll() {
    return await this.KhuyenmaiRepository.find();
  }
  async findid(id: string) {
    return await this.KhuyenmaiRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(slug: any) {
    return await this.KhuyenmaiRepository.findOne({
      where: { Slug: slug},
    });
  }
  async findPagination(page: number, perPage: number){
    const skip = (page - 1) * perPage;
    const totalItems = await this.KhuyenmaiRepository.count();
    const khuyenmais = await this.KhuyenmaiRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: khuyenmais,
    };
  }
  async findQuery(query: string){
    return await this.KhuyenmaiRepository.find({
      where: { Title: Like(`%query%`) },
    });
  }
  async update(id: string, UpdateKhuyenmaiDto: UpdateKhuyenmaiDto) {
    this.KhuyenmaiRepository.save(UpdateKhuyenmaiDto);
    return await this.KhuyenmaiRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.KhuyenmaiRepository.delete(id);
    return { deleted: true };
  }
}
