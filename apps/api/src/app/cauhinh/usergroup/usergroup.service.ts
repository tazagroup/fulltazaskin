import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateUsergroupDto } from './dto/create-usergroup.dto';
import { UpdateUsergroupDto } from './dto/update-usergroup.dto';
import { UsergroupEntity } from './entities/usergroup.entity';
@Injectable()
export class UsergroupService {
  constructor(
    @InjectRepository(UsergroupEntity)
    private UsergroupRepository: Repository<UsergroupEntity>
  ) {}
  async create(CreateUsergroupDto: CreateUsergroupDto) {
    this.UsergroupRepository.create(CreateUsergroupDto);
    return await this.UsergroupRepository.save(CreateUsergroupDto);
  }

  async findAll() {
    return await this.UsergroupRepository.find();
  }
  async findid(id: string) {
    return await this.UsergroupRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(slug: any) {
    return await this.UsergroupRepository.findOne({
      where: { Slug: slug},
    });
  }
  async findPagination(page: number, perPage: number){
    const skip = (page - 1) * perPage;
    const totalItems = await this.UsergroupRepository.count();
    const usergroups = await this.UsergroupRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: usergroups,
    };
  }
  async findQuery(query: string){
    return await this.UsergroupRepository.find({
      where: { Title: Like(`%query%`) },
    });
  }
  async update(id: string, UpdateUsergroupDto: UpdateUsergroupDto) {
    this.UsergroupRepository.save(UpdateUsergroupDto);
    return await this.UsergroupRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.UsergroupRepository.delete(id);
    return { deleted: true };
  }
}
