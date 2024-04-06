import { PartialType } from '@nestjs/mapped-types';
import { CreateVttechlieutrinhDto } from './create-vttechlieutrinh.dto';

export class UpdateVttechlieutrinhDto extends PartialType(CreateVttechlieutrinhDto) {}
