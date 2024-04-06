import { Injectable } from '@nestjs/common';
import { CreateVttechlieutrinhDto } from './dto/create-vttechlieutrinh.dto';
import { UpdateVttechlieutrinhDto } from './dto/update-vttechlieutrinh.dto';

@Injectable()
export class VttechlieutrinhService {
  create(createVttechlieutrinhDto: CreateVttechlieutrinhDto) {
    return 'This action adds a new vttechlieutrinh';
  }

  findAll() {
    return `This action returns all vttechlieutrinh`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vttechlieutrinh`;
  }

  update(id: number, updateVttechlieutrinhDto: UpdateVttechlieutrinhDto) {
    return `This action updates a #${id} vttechlieutrinh`;
  }

  remove(id: number) {
    return `This action removes a #${id} vttechlieutrinh`;
  }
}
