import { PartialType } from '@nestjs/mapped-types';
import { CreateTripMemberDto } from './create-trip-member.dto';

export class UpdateTripMemberDto extends PartialType(CreateTripMemberDto) {}
