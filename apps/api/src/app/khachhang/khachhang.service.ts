import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateKhachhangDto } from './dto/create-khachhang.dto';
import { UpdateKhachhangDto } from './dto/update-khachhang.dto';
import { KhachhangEntity } from './entities/khachhang.entity';
import { CauhinhService } from '../cauhinh/cauhinh.service';
@Injectable()
export class KhachhangService {
  constructor(
    @InjectRepository(KhachhangEntity)
    private KhachhangRepository: Repository<KhachhangEntity>,
    private _CauhinhService: CauhinhService
  ) {}
  async create(CreateKhachhangDto: CreateKhachhangDto) {
    this.KhachhangRepository.create(CreateKhachhangDto);
    return await this.KhachhangRepository.save(CreateKhachhangDto);
  }

  async findAll() {
    return await this.KhachhangRepository.find();
  }
  async findid(id: string) {
    return await this.KhachhangRepository.findOne({
      where: { id: id },

    });
  }
  async findsdt(sdt: any) {
    let Hangthanhvien:any={Data:[]}
    Hangthanhvien = await this._CauhinhService.findslug('hang-thanh-vien')
    const Khachhang = await this.KhachhangRepository.findOne({where: { SDT: sdt}});
    Khachhang.Hangthanhvien = Hangthanhvien.Data.find((v:any)=>Khachhang.Doanhthu>=v.FromAmount && Khachhang.Doanhthu<v.ToAmount)
    return Khachhang
  }
  async update(id: string, UpdateKhachhangDto: UpdateKhachhangDto) {
    this.KhachhangRepository.save(UpdateKhachhangDto);
    return await this.KhachhangRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.KhachhangRepository.delete(id);
    return { deleted: true };
  }
}

