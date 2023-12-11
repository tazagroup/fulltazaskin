import { PartialType } from '@nestjs/mapped-types';
import { CreateZaloznDto } from './create-zalozn.dto';

export class UpdateZaloznDto extends PartialType(CreateZaloznDto) {}
