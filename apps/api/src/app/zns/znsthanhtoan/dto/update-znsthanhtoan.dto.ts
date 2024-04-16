import { PartialType } from '@nestjs/mapped-types';
import { CreateZnsthanhtoanDto } from './create-znsthanhtoan.dto';

export class UpdateZnsthanhtoanDto extends PartialType(CreateZnsthanhtoanDto) {}
