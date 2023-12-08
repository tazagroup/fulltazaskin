import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateKhachhangchitietDto } from './dto/create-khachhangchitiet.dto';
import { UpdateKhachhangchitietDto } from './dto/update-khachhangchitiet.dto';
import { KhachhangchitietEntity } from './entities/khachhangchitiet.entity';
@Injectable()
export class KhachhangchitietService {
  constructor(
    @InjectRepository(KhachhangchitietEntity)
    private KhachhangchitietRepository: Repository<KhachhangchitietEntity>
  ) {}
  async create(CreateKhachhangchitietDto: CreateKhachhangchitietDto) {
    this.KhachhangchitietRepository.create(CreateKhachhangchitietDto);
    return await this.KhachhangchitietRepository.save(CreateKhachhangchitietDto);
  }

  async findAll() {
    return await this.KhachhangchitietRepository.find();
  }
  async findid(id: string) {
    return await this.KhachhangchitietRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(slug: any) {
    return await this.KhachhangchitietRepository.findOne({
      where: { Slug: slug},
    });
  }
  async findsdt(sdt: any) {
    return await this.KhachhangchitietRepository.find({
      where: { SDT: sdt},
    });
  }
  async update(id: string, UpdateKhachhangchitietDto: UpdateKhachhangchitietDto) {
    this.KhachhangchitietRepository.save(UpdateKhachhangchitietDto);
    return await this.KhachhangchitietRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.KhachhangchitietRepository.delete(id);
    return { deleted: true };
  }
}
