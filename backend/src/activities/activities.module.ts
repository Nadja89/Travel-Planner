import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices'; // Dodato
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { ActivityEntity } from './entities/activity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActivityEntity]),
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
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}