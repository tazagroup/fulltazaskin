import { Injectable } from '@nestjs/common';
import { CreateZalominiappDto } from './dto/create-zalominiapp.dto';
import { UpdateZalominiappDto } from './dto/update-zalominiapp.dto';

@Injectable()
export class ZalominiappService {
  create(createZalominiappDto: CreateZalominiappDto) {
    return 'This action adds a new zalominiapp';
  }
  findAll() {
    return `This action returns all zalominiapp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} zalominiapp`;
  }

  update(id: number, updateZalominiappDto: UpdateZalominiappDto) {
    return `This action updates a #${id} zalominiapp`;
  }

  remove(id: number) {
    return `This action removes a #${id} zalominiapp`;
  }
}
