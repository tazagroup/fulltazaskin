import { PartialType } from '@nestjs/mapped-types';
import { CreateKhachhangdanhgiaDto } from './create-khachhangdanhgia.dto';

export class UpdateKhachhangdanhgiaDto extends PartialType(CreateKhachhangdanhgiaDto) {}
