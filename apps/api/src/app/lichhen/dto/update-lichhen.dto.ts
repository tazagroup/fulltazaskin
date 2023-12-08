import { PartialType } from '@nestjs/mapped-types';
import { CreateLichhenDto } from './create-lichhen.dto';

export class UpdateLichhenDto extends PartialType(CreateLichhenDto) {}
