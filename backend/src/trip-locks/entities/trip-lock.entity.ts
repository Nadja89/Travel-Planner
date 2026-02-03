import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { TripPlanEntity } from '../../trip-plans/entities/trip-plan.entity';

@Entity('trip_locks')
export class TripLockEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  
  @ManyToOne(() => TripPlanEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tripPlanId' })
  plan: TripPlanEntity;

  @Column({ type: 'uuid', unique: true })
  tripPlanId: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  korisnik: UserEntity;

  @Column({ type: 'uuid' })
  userId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  zakljucanoU: Date;
}

