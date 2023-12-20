import { PartialType } from '@nestjs/mapped-types';
import { CreateVttechDto } from './create-vttech.dto';

export class UpdateVttechDto extends PartialType(CreateVttechDto) {}
