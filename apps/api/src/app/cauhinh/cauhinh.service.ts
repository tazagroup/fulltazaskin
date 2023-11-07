import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCauhinhDto } from './dto/create-cauhinh.dto';
import { UpdateCauhinhDto } from './dto/update-cauhinh.dto';
import { CauhinhEntity } from './entities/cauhinh.entity';
@Injectable()
export class CauhinhService {
  constructor(
    @InjectRepository(CauhinhEntity)
    private CauhinhRepository: Repository<CauhinhEntity>
  ) {}
  async create(CreateCauhinhDto: CreateCauhinhDto) {
    this.CauhinhRepository.create(CreateCauhinhDto);
    return await this.CauhinhRepository.save(CreateCauhinhDto);
  }
  async findAll() {
    return await this.CauhinhRepository.find();
  }
  async findid(id: string) {
    return await this.CauhinhRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(slug: any) {
    return await this.CauhinhRepository.findOne({
      where: { Slug: slug},
    });
  }
  async update(id: string, UpdateCauhinhDto: UpdateCauhinhDto) {
    this.CauhinhRepository.save(UpdateCauhinhDto);
    return await this.CauhinhRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.CauhinhRepository.delete(id);
    return { deleted: true };
  }
}

