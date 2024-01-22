import { PartialType } from '@nestjs/mapped-types';
import { CreateVttech_thanhtoanDto } from './create-vttech_thanhtoan.dto';

export class UpdateVttech_thanhtoanDto extends PartialType(CreateVttech_thanhtoanDto) {}
