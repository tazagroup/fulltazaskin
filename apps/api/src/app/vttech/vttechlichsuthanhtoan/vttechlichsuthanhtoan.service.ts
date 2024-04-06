import { Injectable } from '@nestjs/common';
import { CreateVttechlichsuthanhtoanDto } from './dto/create-vttechlichsuthanhtoan.dto';
import { UpdateVttechlichsuthanhtoanDto } from './dto/update-vttechlichsuthanhtoan.dto';

@Injectable()
export class VttechlichsuthanhtoanService {
  create(createVttechlichsuthanhtoanDto: CreateVttechlichsuthanhtoanDto) {
    return 'This action adds a new vttechlichsuthanhtoan';
  }

  findAll() {
    return `This action returns all vttechlichsuthanhtoan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vttechlichsuthanhtoan`;
  }

  update(id: number, updateVttechlichsuthanhtoanDto: UpdateVttechlichsuthanhtoanDto) {
    return `This action updates a #${id} vttechlichsuthanhtoan`;
  }

  remove(id: number) {
    return `This action removes a #${id} vttechlichsuthanhtoan`;
  }
}
