import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TripMembersService } from './trip-members.service';
import { CreateTripMemberDto } from './dto/create-trip-member.dto';
import { UpdateTripMemberDto } from './dto/update-trip-member.dto';

@Controller('trip-members')
export class TripMembersController {
  constructor(private readonly tripMembersService: TripMembersService) {}

  @Post()
  create(@Body() createTripMemberDto: CreateTripMemberDto) {
    return this.tripMembersService.create(createTripMemberDto);
  }

  @Get()
  findAll() {
    return this.tripMembersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripMembersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripMembersService.remove(id);
  }
}
