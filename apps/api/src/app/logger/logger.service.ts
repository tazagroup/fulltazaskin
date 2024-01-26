import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateLoggerDto } from './dto/create-logger.dto';
import { UpdateLoggerDto } from './dto/update-logger.dto';
import { LoggerEntity } from './entities/logger.entity';
@Injectable()
export class LoggerService {
  constructor(
    @InjectRepository(LoggerEntity)
    private LoggerRepository: Repository<LoggerEntity>
  ) {}
  async create(CreateLoggerDto: CreateLoggerDto) {
    this.LoggerRepository.create(CreateLoggerDto);
    return await this.LoggerRepository.save(CreateLoggerDto);
  }

  async findAll() {
    return await this.LoggerRepository.find();
  }
  async findid(id: string) {
    return await this.LoggerRepository.findOne({
      where: { id: id },

    });
  }
  async findPagination(page: number, perPage: number){
    const skip = (page - 1) * perPage;
    const totalItems = await this.LoggerRepository.count();
    const loggers = await this.LoggerRepository.find({ skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: loggers,
    };
  }
  async findQuery(params: any) {
    console.error(params);
    const queryBuilder = this.LoggerRepository.createQueryBuilder('logger');
    if (params.Batdau && params.Ketthuc) {
      queryBuilder.andWhere('logger.CreateAt BETWEEN :startDate AND :endDate', {
        startDate:params.Batdau,
        endDate:params.Ketthuc,
      });
    }
    if (params.hasOwnProperty('Title')) {
      queryBuilder.andWhere('logger.Title LIKE :Title', { Title: `%${params.Title}%` });
    }
    if (params.hasOwnProperty('Mota')) {
      queryBuilder.andWhere('logger.Mota LIKE :Mota', { Mota: `%${params.Mota}%` });
    }
    const [items, totalCount] = await queryBuilder
    .limit(params.pageSize || 10)
    .offset(params.pageNumber * params.pageSize || 0)
    .getManyAndCount();
  return { items, totalCount };
  }
  async update(id: string, UpdateLoggerDto: UpdateLoggerDto) {
    this.LoggerRepository.save(UpdateLoggerDto);
    return await this.LoggerRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    console.error(id)
    await this.LoggerRepository.delete(id);
    return { deleted: true };
  }
}
