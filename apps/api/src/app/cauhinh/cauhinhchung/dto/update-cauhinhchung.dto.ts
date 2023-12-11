import { PartialType } from '@nestjs/mapped-types';
import { CreateCauhinhchungDto } from './create-cauhinhchung.dto';

export class UpdateCauhinhchungDto extends PartialType(CreateCauhinhchungDto) {}
