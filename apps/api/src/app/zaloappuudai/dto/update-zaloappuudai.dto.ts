import { PartialType } from '@nestjs/mapped-types';
import { CreateZaloappuudaiDto } from './create-zaloappuudai.dto';

export class UpdateZaloappuudaiDto extends PartialType(CreateZaloappuudaiDto) {}
