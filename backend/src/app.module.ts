import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TripPlansModule } from './trip-plans/trip-plans.module';
import { TripMembersModule } from './trip-members/trip-members.module';
import { TripLocksModule } from './trip-locks/trip-locks.module';
import { ActivitiesModule } from './activities/activities.module';





@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'nadja',
      database: 'travel_planner',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    TripPlansModule,
    TripMembersModule,
    TripLocksModule,
    ActivitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

