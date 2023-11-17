import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { CreateChitietDto } from './dto/create-chitiet.dto';
import { UpdateChitietDto } from './dto/update-chitiet.dto';
import { ChitietEntity } from './entities/chitiet.entity';
@Injectable()
export class ChitietService {
  constructor(
    @InjectRepository(ChitietEntity)
    private ChitietRepository: Repository<ChitietEntity>,
  ) {}
  async create(createChitietDto: CreateChitietDto) {
    this.ChitietRepository.create(createChitietDto);
    return await this.ChitietRepository.save(createChitietDto);
  }
  async findAll() {
    const data = await this.ChitietRepository.find();
    const groupedData = data.reduce((acc, item) => {
      const existingItem = acc.find((groupedItem) => groupedItem.id === item.id);
      if (!existingItem) {
        acc.push({
          id: item.id,
          TenKH: item.TenKH,
          Dichvu: item.Dichvu,
          SDT: item.SDT,
          SDT2: item.SDT2,
          Doanhso: item.Doanhso,
          Tonglieutrinh: item.Tonglieutrinh,
          Dathu: item.Dathu,
        });
      } else {
        existingItem.Doanhso += item.Doanhso;
        existingItem.Tonglieutrinh += item.Tonglieutrinh;
        existingItem.Dathu += item.Dathu;
      }
    
      return acc;
    }, []);
    console.error(groupedData);
    return groupedData
  }
  async findpaged(skip:number=0,take: number = 10) {
    const [data, total] = await this.ChitietRepository.findAndCount(
      { 
        take:take,
        skip:skip }
      );
      const uniqueData = data.reduce((acc, item) => {
        if (!acc.some(existingItem => existingItem.SDT == item.SDT)) {
          acc.push(item);
        }
        return acc;
      }, []);
      const length = uniqueData.length
      // const groupedData = data.reduce((acc, item) => {
      //   const existingItem = acc.find((groupedItem) => groupedItem.id === item.id);
      //   if (!existingItem) {
      //     acc.push({
      //       id: item.id,
      //       TenKH: item.TenKH,
      //       Dichvu: item.Dichvu,
      //       SDT: item.SDT,
      //       SDT2: item.SDT2,
      //       Doanhso: item.Doanhso,
      //       Tonglieutrinh: item.Tonglieutrinh,
      //       Dathu: item.Dathu,
      //     });
      //   } else {
      //     existingItem.Doanhso += item.Doanhso;
      //     existingItem.Tonglieutrinh += item.Tonglieutrinh;
      //     existingItem.Dathu += item.Dathu;
      //   }
      
      //   return acc;
      // }, []);
      // console.error(groupedData);

    return { uniqueData ,length, total };
  }
  async findCount() {
    return await this.ChitietRepository.findAndCount();
  }
  async findBySDT(SDT: string) {
    return await this.ChitietRepository.find(
      { where :{SDT:SDT}}
    );
  }
  async findByDay(batdau,kethuc) {
    const bd = new Date(batdau);
    const kt = new Date(kethuc);
  return await this.ChitietRepository.find(
      { where :{NgayTaoDV: Between(bd, kt)}}
    );
  }
  async findByTenKH(TenKH: string) {
    return await this.ChitietRepository.find(
      { where :{TenKH: Like(TenKH)}}

    );
  }
  async findByChinhanh(Chinhanh: string) {
    return await this.ChitietRepository.find(
      { where :{Chinhanh: Chinhanh}}

    );
  }
  async update(id: string, updateChitietDto: UpdateChitietDto) {
    await this.ChitietRepository.update(id, updateChitietDto);
    return await this.ChitietRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    await this.ChitietRepository.delete(id);
    return { deleted: true };
  } 
}
