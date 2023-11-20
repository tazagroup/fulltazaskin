import { PartialType } from '@nestjs/mapped-types';
import { CreateChinhanhDto } from './create-chinhanh.dto';

export class UpdateChinhanhDto extends PartialType(CreateChinhanhDto) {}
