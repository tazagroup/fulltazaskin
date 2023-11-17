import { PartialType } from '@nestjs/mapped-types';
import { CreateKhachhangDto } from './create-khachhang.dto';

export class UpdateKhachhangDto extends PartialType(CreateKhachhangDto) {}
