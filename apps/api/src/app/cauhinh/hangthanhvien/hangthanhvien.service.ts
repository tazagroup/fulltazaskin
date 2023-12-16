import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateHangthanhvienDto } from './dto/create-hangthanhvien.dto';
import { UpdateHangthanhvienDto } from './dto/update-hangthanhvien.dto';
import { HangthanhvienEntity } from './entities/hangthanhvien.entity';
@Injectable()
export class HangthanhvienService {
  constructor(
    @InjectRepository(HangthanhvienEntity)
    private HangthanhvienRepository: Repository<HangthanhvienEntity>
  ) {}
  async create(CreateHangthanhvienDto: CreateHangthanhvienDto) {
    this.HangthanhvienRepository.create(CreateHangthanhvienDto);
    return await this.HangthanhvienRepository.save(CreateHangthanhvienDto);
  }

  async findAll() {
    return await this.HangthanhvienRepository.find();
  }
  async findid(id: string) {
    return await this.HangthanhvienRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(slug: any) {
    return await this.HangthanhvienRepository.findOne({
      where: { Slug: slug},
    });
  }
  async findPagination(page: number, perPage: number){
    const skip = (page - 1) * perPage;
    const totalItems = await this.HangthanhvienRepository.count();
    const hangthanhviens = await this.HangthanhvienRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: hangthanhviens,
    };
  }
  async findQuery(query: string){
    return await this.HangthanhvienRepository.find({
      where: { Title: Like(`%query%`) },
    });
  }
  async update(id: string, UpdateHangthanhvienDto: UpdateHangthanhvienDto) {
    this.HangthanhvienRepository.save(UpdateHangthanhvienDto);
    return await this.HangthanhvienRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    //console.error(id)
    await this.HangthanhvienRepository.delete(id);
    return { deleted: true };
  }
}
