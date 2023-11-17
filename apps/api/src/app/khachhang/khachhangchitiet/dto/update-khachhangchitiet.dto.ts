import { PartialType } from '@nestjs/mapped-types';
import { CreateKhachhangchitietDto } from './create-khachhangchitiet.dto';

export class UpdateKhachhangchitietDto extends PartialType(CreateKhachhangchitietDto) {}
