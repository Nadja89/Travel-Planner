import { PartialType } from '@nestjs/mapped-types';
import { CreateTripLockDto } from './create-trip-lock.dto';

export class UpdateTripLockDto extends PartialType(CreateTripLockDto) {}
