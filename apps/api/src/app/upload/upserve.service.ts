import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { UploadEntity } from './entities/upload.entity';
import fs = require('fs');
@Injectable()
export class UpserveService {
  constructor(
    @InjectRepository(UploadEntity)
    private UploadRepository: Repository<UploadEntity>
  ) {}
  async create(createUploadDto: CreateUploadDto) {
    this.UploadRepository.create(createUploadDto);
    return await this.UploadRepository.save(createUploadDto);
  }
  async findAll() {
    return await this.UploadRepository.find();
  }
  async findOne(id: string) {
    return await this.UploadRepository.findOne({ where: { id: id } });
  }
  async update(id: string, updateUploadDto: UpdateUploadDto) {
    await this.UploadRepository.update(id, updateUploadDto);
    return await this.UploadRepository.findOne({ where: { id: id } });
  }

  async remove(id: string) {
    await this.UploadRepository.delete(id);
    return { deleted: true };
  }
  async upload(file: any) {
    const data = {
        name: file.name,
        Mime: file.mimetype,
        spath:file.path,
        alt:file.alt,
        idTao:file.idTao
      };
    return this.create(data);
  }
  async DeleteFile(path: any) {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
      return true;
    } else {
      console.error(false);
      return false;
    }
  }
}
