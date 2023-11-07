import { Injectable } from '@nestjs/common';
import { CreateKhachhangDto } from './dto/create-khachhang.dto';
import { UpdateKhachhangDto } from './dto/update-khachhang.dto';

@Injectable()
export class KhachhangService {
  constructor() {}
  create(createKhachhangDto: CreateKhachhangDto) {
    return 'This action adds a new khachhang';
  }

  findAll() {
   // return this.prisma.article.findMany({ where: { published: true } });
  }

  findOne(id: number) {
  //  return this.prisma.article.findUnique({ where: { id } });
  }

  update(id: number, updateKhachhangDto: UpdateKhachhangDto) {
    return `This action updates a #${id} khachhang`;
  }

  remove(id: number) {
    return `This action removes a #${id} khachhang`;
  }
}
