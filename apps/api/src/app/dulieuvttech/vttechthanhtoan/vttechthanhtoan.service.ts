import { Injectable } from '@nestjs/common';
import { CreateVttechthanhtoanDto } from './dto/create-vttechthanhtoan.dto';
import { UpdateVttechthanhtoanDto } from './dto/update-vttechthanhtoan.dto';

@Injectable()
export class VttechthanhtoanService {
  create(createVttechthanhtoanDto: CreateVttechthanhtoanDto) {
    return 'This action adds a new vttechthanhtoan';
  }

  findAll() {
    return `This action returns all vttechthanhtoan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vttechthanhtoan`;
  }

  update(id: number, updateVttechthanhtoanDto: UpdateVttechthanhtoanDto) {
    return `This action updates a #${id} vttechthanhtoan`;
  }

  remove(id: number) {
    return `This action removes a #${id} vttechthanhtoan`;
  }
}
