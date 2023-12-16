import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuEntity } from './entities/menu.entity';
@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private MenuRepository: Repository<MenuEntity>
  ) {}
  async create(CreateMenuDto: CreateMenuDto) {
    this.MenuRepository.create(CreateMenuDto);
    return await this.MenuRepository.save(CreateMenuDto);
  }

  async findAll() {
    return await this.MenuRepository.find();
  }
  async findid(id: string) {
    return await this.MenuRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(slug: any) {
    return await this.MenuRepository.findOne({
      where: { Slug: slug},
    });
  }
  async findPagination(page: number, perPage: number){
    const skip = (page - 1) * perPage;
    const totalItems = await this.MenuRepository.count();
    const menus = await this.MenuRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: menus,
    };
  }
  async findQuery(query: string){
    return await this.MenuRepository.find({
      where: { Title: Like(`%query%`) },
    });
  }
  async update(id: string, UpdateMenuDto: UpdateMenuDto) {
    this.MenuRepository.save(UpdateMenuDto);
    return await this.MenuRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.MenuRepository.delete(id);
    return { deleted: true };
  }
}
