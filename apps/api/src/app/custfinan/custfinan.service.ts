import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateCustfinanDto } from './dto/create-custfinan.dto';
import { UpdateCustfinanDto } from './dto/update-custfinan.dto';
import { CustfinanEntity } from './entities/custfinan.entity';
import { VttechdieutriService } from '../vttech/vttechdieutri/vttechdieutri.service';
import { VttechkhachhangService } from '../vttech/vttechkhachhang/vttechkhachhang.service';
import { VttechlichhenService } from '../vttech/vttechlichhen/vttechlichhen.service';
import { VttechthanhtoanService } from '../vttech/vttechthanhtoan/vttechthanhtoan.service';
@Injectable()
export class CustfinanService {
  constructor(
    @InjectRepository(CustfinanEntity)
    private CustfinanRepository: Repository<CustfinanEntity>,
    private _VttechlichhenService: VttechlichhenService,
    private _VttechthanhtoanService: VttechthanhtoanService,
    private _VttechkhachhangService: VttechkhachhangService,
    private _VttechdieutriService:  VttechdieutriService,

  ) {}
  async create(CreateCustfinanDto: CreateCustfinanDto) {
    this.CustfinanRepository.create(CreateCustfinanDto);
    return await this.CustfinanRepository.save(CreateCustfinanDto);
  }

  async findAll() {
    return await this.CustfinanRepository.find();
  }
  async findid(id: string) {
    return await this.CustfinanRepository.findOne({
      where: { id: id },

    });
  }
  async findSDT(SDT: string) {
    const Info:any = {}
    const Khachhang = await this._VttechkhachhangService.findsdt(SDT)
    console.error(Khachhang);
    if(Khachhang)
    {
      const Lichhen = await this._VttechlichhenService.findbycode(Khachhang.Code)
      const Thanhtoan = await this._VttechthanhtoanService.findbycode(Khachhang.Code)
      const Dieutri = await this._VttechdieutriService.findbycode(Khachhang.Code)
      console.error(Lichhen);
      console.error(Thanhtoan);
      console.error(Dieutri);
      Info.Khachhang = Khachhang
      Info.Lichhen = Lichhen
      Info.Thanhtoan = Thanhtoan
      Info.Dieutri = Dieutri
    }  
    return Info
    // return await this.CustfinanRepository.findOne({
    //   where: { SDT: SDT },
    // });

  }
  async findidKH(idKH: string) {
    return await this.CustfinanRepository.findOne({
      where: { idKH: idKH },
    });
  }
  async findslug(slug: any) {
    return await this.CustfinanRepository.findOne({
      where: { Slug: slug},
    });
  }
  async findPagination(page: number, perPage: number){
    const skip = (page - 1) * perPage;
    const totalItems = await this.CustfinanRepository.count();
    const custfinans = await this.CustfinanRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: custfinans,
    };
  }
  async findQuery(query: string){
    return await this.CustfinanRepository.find({
      where: { Title: Like(`%query%`) },
    });
  }
  async update(id: string, UpdateCustfinanDto: UpdateCustfinanDto) {
    this.CustfinanRepository.save(UpdateCustfinanDto);
    return await this.CustfinanRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    //console.error(id)
    await this.CustfinanRepository.delete(id);
    return { deleted: true };
  }
}
