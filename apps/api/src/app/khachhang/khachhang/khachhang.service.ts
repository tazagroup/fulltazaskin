import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateKhachhangDto, SearchParamsDto } from './dto/create-khachhang.dto';
import { UpdateKhachhangDto } from './dto/update-khachhang.dto';
import { KhachhangEntity } from './entities/khachhang.entity';
import { CauhinhService } from '../../cauhinh/cauhinh.service';

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
  async findByChinhanh(Chinhanh: string) {
    return await this.KhachhangRepository.find(
      { where :{Chinhanh:Chinhanh}}
    );
  }
  async search(params: SearchParamsDto): Promise<{ rows: any[]; count: number }>{
    try {
      const results = await this.KhachhangRepository.findAndCount({
        where: {
          Chinhanh: params.idChinhanh,
          SDT: params.SDT,
        },
        take: params.take, // Replace with actual value or variable
        skip: params.skip, // Replace with actual value or variable
      });
      return {
        rows: results[0], // array of KhachhangEntity objects
        count: results[1], // total count
      };
    } catch (error) {
      // Handle error and log or throw it
      console.error(error);
      // Consider returning an error object for further handling
      return { rows: [], count: 0 };
    }
  }
  async findOneBySDT(SDT: string) {
    // return await this.KhachhangRepository.findOne(
    //   { where :{SDT:SDT}}
    // );
      let Hangthanhvien:any={Data:[]}
      Hangthanhvien = await this._CauhinhService.findslug('hang-thanh-vien')
      const Khachhang = await this.KhachhangRepository.findOne({where: { SDT: SDT}});
      Khachhang.Hangthanhvien = Hangthanhvien.Data.find((v:any)=>Khachhang?.Dathu>=v.FromAmount && Khachhang?.Dathu<v.ToAmount)
      return Khachhang
  }
  async findBySDT(SDT: string) {
    return await this.KhachhangRepository.find(
      { where :{SDT:SDT}}
    );
  }
  async findByTenKH(TenKH: string) {
    return await this.KhachhangRepository.find(
      { where :{TenKH: Like(TenKH)}}

    );
  }
  async findpaged(skip:number=0,take: number = 10) {
    const [data, total] = await this.KhachhangRepository.findAndCount(
      { 
        take:take,
        skip:skip }
      );
    return { data, total };
  }
  update(id: number, updateKhachhangDto: UpdateKhachhangDto) {
    return `This action updates a #${id} khachhang`;
  }

  remove(id: number) {
    return `This action removes a #${id} khachhang`;
  }
}
