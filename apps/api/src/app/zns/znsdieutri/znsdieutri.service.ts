import { Injectable } from '@nestjs/common';
import { CreateZnsdieutriDto } from './dto/create-znsdieutri.dto';
import { UpdateZnsdieutriDto } from './dto/update-znsdieutri.dto';

@Injectable()
export class ZnsdieutriService {
  create(createZnsdieutriDto: CreateZnsdieutriDto) {
    return 'This action adds a new znsdieutri';
  }

  findAll() {
    return `This action returns all znsdieutri`;
  }

  findOne(id: number) {
    return `This action returns a #${id} znsdieutri`;
  }

  update(id: number, updateZnsdieutriDto: UpdateZnsdieutriDto) {
    return `This action updates a #${id} znsdieutri`;
  }

  remove(id: number) {
    return `This action removes a #${id} znsdieutri`;
  }
}
