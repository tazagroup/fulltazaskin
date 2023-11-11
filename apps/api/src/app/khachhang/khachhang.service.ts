import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateKhachhangDto } from './dto/create-khachhang.dto';
import { UpdateKhachhangDto } from './dto/update-khachhang.dto';
import { KhachhangEntity } from './entities/khachhang.entity';
@Injectable()
export class KhachhangService {
  constructor(
    @InjectRepository(KhachhangEntity)
    private KhachhangRepository: Repository<KhachhangEntity>
  ) {}
  async create(CreateKhachhangDto: CreateKhachhangDto) {
    this.KhachhangRepository.create(CreateKhachhangDto);
    return await this.KhachhangRepository.save(CreateKhachhangDto);
  }

  async findAll() {
    return await this.KhachhangRepository.find();
  }
  async findid(id: string) {
    return await this.KhachhangRepository.findOne({
      where: { id: id },

    });
  }
  async findsdt(sdt: any) {
    return await this.KhachhangRepository.findOne({
      where: { SDT: sdt},
    });
  }
  async update(id: string, UpdateKhachhangDto: UpdateKhachhangDto) {
    this.KhachhangRepository.save(UpdateKhachhangDto);
    return await this.KhachhangRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.KhachhangRepository.delete(id);
    return { deleted: true };
  }
}

