import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { UploadEntity } from './entities/upload.entity';
import fs = require('fs');
import stream = require('stream');
import path = require('path');
@Injectable()
export class UploadService {
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

  async remove(id:string,data:any) {
     if (fs.existsSync('/home/tazaspac/tazaskin/images/'+data.spath)) {
        fs.unlinkSync('/home/tazaspac/tazaskin/images/'+data.spath);
        await this.UploadRepository.delete(id);
        return { deleted: true };
      } 
     else
      {
        //console.error(false);
        return false;
      }
  }
  async upload(item: any) {
    //bufferStream.end(item.buffer);
    try {
      const absolutePath = item.path;
      const rootPath = '/home/tazaspac/tazaskin/images';   
      const relativePath = path.relative(rootPath, absolutePath);
      // const parts = item.path.split('/');
      // const extractedPath = parts.slice(2).join('/');
      let data = {
        name: item.originalname,
        //idDrive: res.data.id||'',
        Mime: item.mimetype,
        spath:relativePath,
        alt: item.alt,
      }; 
      //console.error(data);
      //console.error(relativePath);
      return this.create(data);
    } catch (err) {
      throw err;
    }
  }
  async uploadlocal(item: any) {
    try {
      //const host = 'https://images.tazaskin.com/'
      const host = 'https://images.tazaskin.com/'
      const absolutePath = item.path;
      const rootPath = '/home/tazaspac/tazaskinclinic/images';   
      const relativePath = path.relative(rootPath, absolutePath);
      let data = {
        name: item.originalname,
        Mime: item.mimetype,
        spath:relativePath,
        src:host+relativePath,
        alt: item.alt,
      }; 
      console.log(item);
      
      return this.create(data);
    } catch (err) {
      throw err;
    }
  }
  async DeleteFile(path: any) {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
      return true;
    } else {
     // console.error(false);
      return false;
    }
  }
  
}
