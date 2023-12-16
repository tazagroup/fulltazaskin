import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { BannerEntity } from './entities/banner.entity';
@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerEntity)
    private BannerRepository: Repository<BannerEntity>
  ) {}
  async create(CreateBannerDto: CreateBannerDto) {
    this.BannerRepository.create(CreateBannerDto);
    return await this.BannerRepository.save(CreateBannerDto);
  }

  async findAll() {
    return await this.BannerRepository.find();
  }
  async findid(id: string) {
    return await this.BannerRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(slug: any) {
    return await this.BannerRepository.findOne({
      where: { Slug: slug},
    });
  }
  async findPagination(page: number, perPage: number){
    const skip = (page - 1) * perPage;
    const totalItems = await this.BannerRepository.count();
    const banners = await this.BannerRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: banners,
    };
  }
  async findQuery(query: string){
    return await this.BannerRepository.find({
      where: { Title: Like(`%query%`) },
    });
  }
  async update(id: string, UpdateBannerDto: UpdateBannerDto) {
    this.BannerRepository.save(UpdateBannerDto);
    return await this.BannerRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    //console.error(id)
    await this.BannerRepository.delete(id);
    return { deleted: true };
  }
}
