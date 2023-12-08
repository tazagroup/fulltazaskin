import { PartialType } from '@nestjs/mapped-types';
import { CreateDanhgiaDto } from './create-danhgia.dto';

export class UpdateDanhgiaDto extends PartialType(CreateDanhgiaDto) {}
