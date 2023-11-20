import { PartialType } from '@nestjs/mapped-types';
import { CreateHangthanhvienDto } from './create-hangthanhvien.dto';

export class UpdateHangthanhvienDto extends PartialType(CreateHangthanhvienDto) {}
