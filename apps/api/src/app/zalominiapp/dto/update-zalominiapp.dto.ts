import { PartialType } from '@nestjs/mapped-types';
import { CreateZalominiappDto } from './create-zalominiapp.dto';

export class UpdateZalominiappDto extends PartialType(CreateZalominiappDto) {}
