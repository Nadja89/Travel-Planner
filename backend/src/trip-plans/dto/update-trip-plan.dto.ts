import { PartialType } from '@nestjs/mapped-types';
import { CreateTripPlanDto } from './create-trip-plan.dto';

export class UpdateTripPlanDto extends PartialType(CreateTripPlanDto) {}
