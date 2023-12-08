import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateDanhgiaDto } from './dto/create-danhgia.dto';
import { UpdateDanhgiaDto } from './dto/update-danhgia.dto';
import { DanhgiaEntity } from './entities/danhgia.entity';
@Injectable()
export class DanhgiaService {
  constructor(
    @InjectRepository(DanhgiaEntity)
    private DanhgiaRepository: Repository<DanhgiaEntity>
  ) {}
  async create(CreateDanhgiaDto: CreateDanhgiaDto) {
    this.DanhgiaRepository.create(CreateDanhgiaDto);
    return await this.DanhgiaRepository.save(CreateDanhgiaDto);
  }

  async findAll() {
    return await this.DanhgiaRepository.find();
  }
  async findid(id: string) {
    return await this.DanhgiaRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(slug: any) {
    return await this.DanhgiaRepository.findOne({
      where: { Slug: slug},
    });
  }
  async findDM(idDM: any) {
    return await this.DanhgiaRepository.find({
      where: { idDM: idDM},
    });
  }
  async findPagination(page: number, perPage: number){
    const skip = (page - 1) * perPage;
    const totalItems = await this.DanhgiaRepository.count();
    const danhgias = await this.DanhgiaRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: danhgias,
    };
  }
  async findQuery(query: string){
    return await this.DanhgiaRepository.find({
      where: { Title: Like(`%query%`) },
    });
  }
  async update(id: string, UpdateDanhgiaDto: UpdateDanhgiaDto) {
    this.DanhgiaRepository.save(UpdateDanhgiaDto);
    return await this.DanhgiaRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.DanhgiaRepository.delete(id);
    return { deleted: true };
  }
}
