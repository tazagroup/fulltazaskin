import { Injectable } from '@nestjs/common';
import { CreateZaloappuudaiDto } from './dto/create-zaloappuudai.dto';
import { UpdateZaloappuudaiDto } from './dto/update-zaloappuudai.dto';

@Injectable()
export class ZaloappuudaiService {
  create(createZaloappuudaiDto: CreateZaloappuudaiDto) {
    return 'This action adds a new zaloappuudai';
  }

  findAll() {
    return `This action returns all zaloappuudai`;
  }

  findOne(id: number) {
    return `This action returns a #${id} zaloappuudai`;
  }

  update(id: number, updateZaloappuudaiDto: UpdateZaloappuudaiDto) {
    return `This action updates a #${id} zaloappuudai`;
  }

  remove(id: number) {
    return `This action removes a #${id} zaloappuudai`;
  }
}
