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
  async search(params: any) {
    console.log(params);
    const queryBuilder = this.NavigateRepository.createQueryBuilder('navigate');
    if (params.hasOwnProperty('Query')) {
      queryBuilder.andWhere('navigate.Title LIKE :Title', { Title: `%${params.Query}%` })
      .orWhere('navigate.Mota LIKE :Mota', { Mota: `%${params.Query}%` })
      .orWhere('navigate.Noidung LIKE :Noidung', { Noidung: `%${params.Query}%` });
    }
    if (params.Title) {
      queryBuilder.andWhere('navigate.Title LIKE :Title', { Title: `%${params.Title}%` });
    }
    if (params.hasOwnProperty('Type')) {
      queryBuilder.andWhere('navigate.Type LIKE :Type', { Type: `%${params.Type}%` });
    }
    if (params.hasOwnProperty('Status')) {
      queryBuilder.andWhere('navigate.Status = :Status', { Status: `${params.Status}` });
    }
    if (params.hasOwnProperty('Slug')) {
      queryBuilder.andWhere('navigate.Type LIKE :Slug', { Slug: `%${params.Slug}%` });
    }
    const [items, totalCount] = await queryBuilder
      .limit(params.pageSize || 10) // Set a default page size if not provided
      .offset(params.pageNumber * params.pageSize || 0)
      .getManyAndCount();
    return { items, totalCount };
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
