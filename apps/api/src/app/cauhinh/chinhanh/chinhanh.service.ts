import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateChinhanhDto } from './dto/create-chinhanh.dto';
import { UpdateChinhanhDto } from './dto/update-chinhanh.dto';
import { ChinhanhEntity } from './entities/chinhanh.entity';
@Injectable()
export class ChinhanhService {
  constructor(
    @InjectRepository(ChinhanhEntity)
    private ChinhanhRepository: Repository<ChinhanhEntity>
  ) {}
  async create(CreateChinhanhDto: CreateChinhanhDto) {
    this.ChinhanhRepository.create(CreateChinhanhDto);
    return await this.ChinhanhRepository.save(CreateChinhanhDto);
  }

  async findAll() {
    return await this.ChinhanhRepository.find();
  }
  async findid(id: string) {
    return await this.ChinhanhRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(slug: any) {
    return await this.ChinhanhRepository.findOne({
      where: { Slug: slug},
    });
  }
  async findPagination(page: number, perPage: number){
    const skip = (page - 1) * perPage;
    const totalItems = await this.ChinhanhRepository.count();
    const chinhanhs = await this.ChinhanhRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: chinhanhs,
    };
  }
  async findQuery(query: string){
    return await this.ChinhanhRepository.find({
      where: { Title: Like(`%query%`) },
    });
  }
  async update(id: string, UpdateChinhanhDto: UpdateChinhanhDto) {
    this.ChinhanhRepository.save(UpdateChinhanhDto);
    return await this.ChinhanhRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
   // console.error(id)
    await this.ChinhanhRepository.delete(id);
    return { deleted: true };
  }
}
