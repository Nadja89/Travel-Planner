import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TripLocksService } from './trip-locks.service';
import { CreateTripLockDto } from './dto/create-trip-lock.dto';
import { UpdateTripLockDto } from './dto/update-trip-lock.dto';

@Controller('trip-locks')
export class TripLocksController {
  constructor(private readonly tripLocksService: TripLocksService) {}

  @Post()
  create(@Body() createTripLockDto: CreateTripLockDto) {
    return this.tripLocksService.create(createTripLockDto);
  }

  @Get()
  findAll() {
    return this.tripLocksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripLocksService.findOne(id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripLocksService.remove(id);
  }
}
