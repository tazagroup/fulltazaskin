import { PartialType } from '@nestjs/mapped-types';
import { CreateChitietDto } from './create-chitiet.dto';

export class UpdateChitietDto extends PartialType(CreateChitietDto) {}
