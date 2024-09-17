import { PartialType } from '@nestjs/mapped-types';
import { CreateVttechkhachhangfinalDto } from './create-vttechkhachhangfinal.dto';

export class UpdateVttechkhachhangfinalDto extends PartialType(CreateVttechkhachhangfinalDto) {}
