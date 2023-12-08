import { PartialType } from '@nestjs/mapped-types';
import { CreateNavigateDto } from './create-navigate.dto';

export class UpdateNavigateDto extends PartialType(CreateNavigateDto) {}
