import { PartialType } from '@nestjs/mapped-types';
import { CreateZaloznstrackingDto } from './create-zaloznstracking.dto';

export class UpdateZaloznstrackingDto extends PartialType(CreateZaloznstrackingDto) {}
