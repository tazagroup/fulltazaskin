import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDanhmucDto } from './dto/create-danhmuc.dto';
import { UpdateDanhmucDto } from './dto/update-danhmuc.dto';
import { DanhmucEntity } from './entities/danhmuc.entity';
import { DichvuService } from '../dichvu/dichvu.service';
@Injectable()
export class DanhmucService {
  constructor(
    @InjectRepository(DanhmucEntity)
    private DanhmucRepository: Repository<DanhmucEntity>,
    private _DichvuService: DichvuService
  ) {}
  async create(CreateDanhmucDto: CreateDanhmucDto) {
    this.DanhmucRepository.create(CreateDanhmucDto);
    return await this.DanhmucRepository.save(CreateDanhmucDto);
  }
 nestDataByPid(data: any[], parentId: string): any[] {
    const nestedData: any[] = [];
    data.forEach((item) => {
      if (item.pid === parentId) {
        const children = this.nestDataByPid(data, item.id);
        item.Children = children;
        nestedData.push(item);
      }
    });
    return nestedData;
  }
  async findAll() {
    // const Danhmucs = await this.DanhmucRepository.find();
    // const Dichvus = await this._DichvuService.findAll();
    // Danhmucs.map((v:any) => {
    //   v.isDM = true
    //   v.Dichvu = Dichvus.filter((dichvu) => dichvu.idDM === v.id)||[];
    // });
    // const result = this.nestDataByPid(Danhmucs, '');   
    return await this.DanhmucRepository.find();
  }
  // async findAll() {
  //   const Danhmucs = await this.DanhmucRepository.find();
  //   const Dichvus = await this._DichvuService.findAll();
  //   Danhmucs.map((v:any) => {
  //     v.isDM = true
  //     v.Dichvu = Dichvus.filter((dichvu) => dichvu.idDM === v.id)||[];
  //   });
  //   const result = this.nestDataByPid(Danhmucs, '');   
  //   return result
  // }
  async findid(id: string) {
    return await this.DanhmucRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(slug: any) {
    return await this.DanhmucRepository.findOne({
      where: { Slug: slug},
    });
  }
  async update(id: string, UpdateDanhmucDto: UpdateDanhmucDto) {
    this.DanhmucRepository.save(UpdateDanhmucDto);
    return await this.DanhmucRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.DanhmucRepository.delete(id);
    return { deleted: true };
  }
}
