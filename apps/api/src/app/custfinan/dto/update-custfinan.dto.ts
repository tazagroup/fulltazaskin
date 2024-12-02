import { PartialType } from '@nestjs/mapped-types';
import { CreateCustfinanDto } from './create-custfinan.dto';

export class UpdateCustfinanDto extends PartialType(CreateCustfinanDto) {}
