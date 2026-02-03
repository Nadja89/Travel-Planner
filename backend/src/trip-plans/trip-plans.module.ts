import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripPlansService } from './trip-plans.service';
import { TripPlansController } from './trip-plans.controller';
import { TripPlanEntity } from './entities/trip-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TripPlanEntity])],
  controllers: [TripPlansController],
  providers: [TripPlansService],
})
export class TripPlansModule {}
