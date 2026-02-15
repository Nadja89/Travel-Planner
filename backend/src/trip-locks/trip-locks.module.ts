import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices'; // Dodato
import { TripLocksService } from './trip-locks.service';
import { TripLocksController } from './trip-locks.controller';
import { TripLockEntity } from './entities/trip-lock.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TripLockEntity]),
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
  controllers: [TripLocksController],
  providers: [TripLocksService],
})
export class TripLocksModule {}