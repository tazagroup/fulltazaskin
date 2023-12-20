import { PartialType } from '@nestjs/mapped-types';
import { CreateKhachhangdichvuDto } from './create-khachhangdichvu.dto';

export class UpdateKhachhangdichvuDto extends PartialType(CreateKhachhangdichvuDto) {}
