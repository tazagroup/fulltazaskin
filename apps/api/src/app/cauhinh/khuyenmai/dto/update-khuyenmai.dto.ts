import { PartialType } from '@nestjs/mapped-types';
import { CreateKhuyenmaiDto } from './create-khuyenmai.dto';

export class UpdateKhuyenmaiDto extends PartialType(CreateKhuyenmaiDto) {}
