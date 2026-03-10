import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripLockEntity } from './entities/trip-lock.entity';
import { TripLocksController } from './trip-locks.controller';
import { TripLocksService } from './trip-locks.service';
import { TripLocksGateway } from './trip-locks.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([TripLockEntity])],
  controllers: [TripLocksController],
  providers: [TripLocksService, TripLocksGateway],
  exports: [TripLocksGateway],
})
export class TripLocksModule {}