import { PartialType } from '@nestjs/mapped-types';
import { CreateCauhinhDto } from './create-cauhinh.dto';

export class UpdateCauhinhDto extends PartialType(CreateCauhinhDto) {}
