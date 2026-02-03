import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripLocksService } from './trip-locks.service';
import { TripLocksController } from './trip-locks.controller';
import { TripLockEntity } from './entities/trip-lock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TripLockEntity])],
  controllers: [TripLocksController],
  providers: [TripLocksService],
})
export class TripLocksModule {}
