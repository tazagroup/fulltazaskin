import { PartialType } from '@nestjs/mapped-types';
import { CreateZalotokenDto } from './create-zalotoken.dto';

export class UpdateZalotokenDto extends PartialType(CreateZalotokenDto) {}
