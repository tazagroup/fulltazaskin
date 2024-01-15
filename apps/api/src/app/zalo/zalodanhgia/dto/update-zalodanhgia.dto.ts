import { PartialType } from '@nestjs/mapped-types';
import { CreateZalodanhgiaDto } from './create-zalodanhgia.dto';

export class UpdateZalodanhgiaDto extends PartialType(CreateZalodanhgiaDto) {}
