import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ZaloEntity } from './zalo.entity';
import { UpdateZaloDto } from './update-zalo.dto';
import { GenId } from '../shared.utils';
import axios from 'axios';
import { environment } from '../../environments/environment';
@Injectable()
export class ZaloService {
  constructor(
    @InjectRepository(ZaloEntity)
    private ZaloRepository: Repository<ZaloEntity>,
  ) {}
  async getMeInfo(userAccessToken: string, token: string): Promise<any> {
    const options = {
      url: 'https://graph.zalo.me/v2.0/me/info',
      headers: {
        access_token: userAccessToken,
        code: token,
        secret_key: environment.secret_key
      }
    };
    const response = await axios.get(options.url, { headers: options.headers });
    return response.data;
  }
  async create(CreateZaloDto: any) {
    CreateZaloDto.MaZalo = GenId(8,false)
    this.ZaloRepository.create(CreateZaloDto);
    return await this.ZaloRepository.save(CreateZaloDto);
  }

  async findAll() {
    return await this.ZaloRepository.find();
  }
  async searchzalo(query: string): Promise<any[]> {
    return await this.ZaloRepository
      .createQueryBuilder('zalo')
      .where('LOWER(zalo.Title) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(zalo.Mota) LIKE LOWER(:query)', { query: `%${query}%` })
      // Add more conditions for additional fields (e.g., description, genre, etc.)
      .getMany();
  }
  async findPagina(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return await this.ZaloRepository.findAndCount({ skip, take: limit });
  }
  async findslug(slug: string) {
    return await this.ZaloRepository.findOne({
      // where: { Slug: slug },
    });
  }
  async findid(id: any) {
    return await this.ZaloRepository.findOne({
      where: { id: id },
    });
  }

  async update(id: string, UpdateZaloDto: UpdateZaloDto) {
    this.ZaloRepository.save(UpdateZaloDto);
    return await this.ZaloRepository.findOne({ where: { id: id } });
  }

  async remove(id: string) {
    await this.ZaloRepository.delete(id);
    return { deleted: true };
  }
}