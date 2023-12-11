import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateCauhinhchungDto } from './dto/create-cauhinhchung.dto';
import { UpdateCauhinhchungDto } from './dto/update-cauhinhchung.dto';
import { CauhinhchungEntity } from './entities/cauhinhchung.entity';
@Injectable()
export class CauhinhchungService {
  constructor(
    @InjectRepository(CauhinhchungEntity)
    private CauhinhchungRepository: Repository<CauhinhchungEntity>
  ) {}
  async create(CreateCauhinhchungDto: CreateCauhinhchungDto) {
    this.CauhinhchungRepository.create(CreateCauhinhchungDto);
    return await this.CauhinhchungRepository.save(CreateCauhinhchungDto);
  }

  async findAll() {
    return await this.CauhinhchungRepository.find();
  }
  async findid(id: string) {
    return await this.CauhinhchungRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(slug: any) {
    return await this.CauhinhchungRepository.findOne({
      where: { Slug: slug},
    });
  }
  async findPagination(page: number, perPage: number){
    const skip = (page - 1) * perPage;
    const totalItems = await this.CauhinhchungRepository.count();
    const cauhinhchungs = await this.CauhinhchungRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: cauhinhchungs,
    };
  }
  async findQuery(query: string){
    return await this.CauhinhchungRepository.find({
      where: { Title: Like(`%query%`) },
    });
  }
  async update(id: string, UpdateCauhinhchungDto: UpdateCauhinhchungDto) {
    this.CauhinhchungRepository.save(UpdateCauhinhchungDto);
    return await this.CauhinhchungRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.CauhinhchungRepository.delete(id);
    return { deleted: true };
  }
}
