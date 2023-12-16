import { PartialType } from '@nestjs/mapped-types';
import { CreateUsergroupDto } from './create-usergroup.dto';

export class UpdateUsergroupDto extends PartialType(CreateUsergroupDto) {}
