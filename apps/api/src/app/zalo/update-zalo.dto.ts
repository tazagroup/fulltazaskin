import { PartialType } from '@nestjs/swagger';
import { CreateZaloDto } from './create-zalo.dto';

export class UpdateZaloDto extends PartialType(CreateZaloDto) {}
