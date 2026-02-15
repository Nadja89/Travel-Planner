import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices'; // Dodato
import { TripMembersService } from './trip-members.service';
import { TripMembersController } from './trip-members.controller';
import { TripMemberEntity } from './entities/trip-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TripMemberEntity]),
    
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
  controllers: [TripMembersController],
  providers: [TripMembersService],
})
export class TripMembersModule {}