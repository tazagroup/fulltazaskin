import { PartialType } from '@nestjs/mapped-types';
import { CreateVttechlichsuthanhtoanDto } from './create-vttechlichsuthanhtoan.dto';

export class UpdateVttechlichsuthanhtoanDto extends PartialType(CreateVttechlichsuthanhtoanDto) {}
