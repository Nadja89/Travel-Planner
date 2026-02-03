import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripMembersService } from './trip-members.service';
import { TripMembersController } from './trip-members.controller';
import { TripMemberEntity } from './entities/trip-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TripMemberEntity])],
  controllers: [TripMembersController],
  providers: [TripMembersService],
})
export class TripMembersModule {}

