import { PartialType } from '@nestjs/mapped-types';
import { CreateVttechthanhtoanDto } from './create-vttechthanhtoan.dto';

export class UpdateVttechthanhtoanDto extends PartialType(CreateVttechthanhtoanDto) {}
