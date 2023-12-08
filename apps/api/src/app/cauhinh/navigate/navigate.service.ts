import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateNavigateDto } from './dto/create-navigate.dto';
import { UpdateNavigateDto } from './dto/update-navigate.dto';
import { NavigateEntity } from './entities/navigate.entity';
@Injectable()
export class NavigateService {
  constructor(
    @InjectRepository(NavigateEntity)
    private NavigateRepository: Repository<NavigateEntity>
  ) {}
  async create(CreateNavigateDto: CreateNavigateDto) {
    this.NavigateRepository.create(CreateNavigateDto);
    return await this.NavigateRepository.save(CreateNavigateDto);
  }

  async findAll() {
    return await this.NavigateRepository.find();
  }
  async findid(id: string) {
    return await this.NavigateRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(slug: any) {
    return await this.NavigateRepository.findOne({
      where: { Slug: slug},
    });
  }
  async findPagination(page: number, perPage: number){
    const skip = (page - 1) * perPage;
    const totalItems = await this.NavigateRepository.count();
    const navigates = await this.NavigateRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: navigates,
    };
  }
  async findQuery(query: string){
    return await this.NavigateRepository.find({
      where: { Title: Like(`%query%`) },
    });
  }
  async update(id: string, UpdateNavigateDto: UpdateNavigateDto) {
    this.NavigateRepository.save(UpdateNavigateDto);
    return await this.NavigateRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.NavigateRepository.delete(id);
    return { deleted: true };
  }
}
