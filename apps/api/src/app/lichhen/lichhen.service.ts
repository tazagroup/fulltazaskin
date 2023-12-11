import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateLichhenDto } from './dto/create-lichhen.dto';
import { UpdateLichhenDto } from './dto/update-lichhen.dto';
import { LichhenEntity } from './entities/lichhen.entity';
@Injectable()
export class LichhenService {
  constructor(
    @InjectRepository(LichhenEntity)
    private LichhenRepository: Repository<LichhenEntity>
  ) {}
  async create(CreateLichhenDto: CreateLichhenDto) {
    this.LichhenRepository.create(CreateLichhenDto);
    return await this.LichhenRepository.save(CreateLichhenDto);
  }

  async findAll() {
    return await this.LichhenRepository.find();
    
  }
  async findid(id: string) {
    return await this.LichhenRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(slug: any) {
    return await this.LichhenRepository.findOne({
      where: { Slug: slug},
    });
  }
  async findmadh(madh: any) {
    return await this.LichhenRepository.findOne({
      where: { MaDH: madh},
    });
  }
  async findsdt(SDT: any) {
    return await this.LichhenRepository.find({
      where: { SDTKhac: SDT},
    });
  }
  async findPagination(page: number, perPage: number){
    const skip = (page - 1) * perPage;
    const totalItems = await this.LichhenRepository.count();
    const lichhens = await this.LichhenRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: lichhens,
    };
  }
  async findQuery(query: string){
    return await this.LichhenRepository.find({
      where: { Title: Like(`%query%`) },
    });
  }
  async update(id: string, UpdateLichhenDto: UpdateLichhenDto) {
    this.LichhenRepository.save(UpdateLichhenDto);
    return await this.LichhenRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.LichhenRepository.delete(id);
    return { deleted: true };
  }
}
