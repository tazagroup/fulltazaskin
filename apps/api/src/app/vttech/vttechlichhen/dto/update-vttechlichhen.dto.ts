import { PartialType } from '@nestjs/mapped-types';
import { CreateVttechlichhenDto } from './create-vttechlichhen.dto';

export class UpdateVttechlichhenDto extends PartialType(CreateVttechlichhenDto) {}
