import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TripPlansService } from './trip-plans.service';
import { CreateTripPlanDto } from './dto/create-trip-plan.dto';
import { UpdateTripPlanDto } from './dto/update-trip-plan.dto';

@Controller('trip-plans')
export class TripPlansController {
  constructor(private readonly tripPlansService: TripPlansService) {}

  @Post()
  create(@Body() createTripPlanDto: CreateTripPlanDto) {
    return this.tripPlansService.create(createTripPlanDto);
  }

  @Get()
  findAll() {
    return this.tripPlansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripPlansService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTripPlanDto: UpdateTripPlanDto) {
    return this.tripPlansService.update(id, updateTripPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripPlansService.remove(id);
  }
}
