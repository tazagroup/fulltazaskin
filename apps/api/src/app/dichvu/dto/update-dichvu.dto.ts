import { PartialType } from '@nestjs/mapped-types';
import { CreateDichvuDto } from './create-dichvu.dto';

export class UpdateDichvuDto extends PartialType(CreateDichvuDto) {}
