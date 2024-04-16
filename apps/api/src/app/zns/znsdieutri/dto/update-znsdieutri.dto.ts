import { PartialType } from '@nestjs/mapped-types';
import { CreateZnsdieutriDto } from './create-znsdieutri.dto';

export class UpdateZnsdieutriDto extends PartialType(CreateZnsdieutriDto) {}
