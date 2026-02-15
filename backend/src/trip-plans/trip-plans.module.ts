// src/trip-plans/trip-plans.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TripPlansService } from './trip-plans.service';
import { TripPlansController } from './trip-plans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripPlanEntity } from './entities/trip-plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TripPlanEntity]),
    ClientsModule.register([
      {
        name: 'COMM_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'main_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [TripPlansController],
  providers: [TripPlansService],
})
export class TripPlansModule {}