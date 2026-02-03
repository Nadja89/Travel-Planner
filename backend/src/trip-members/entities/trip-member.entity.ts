import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';
import { TripPlanEntity } from '../../trip-plans/entities/trip-plan.entity';

@Unique(['tripPlanId', 'userId'])
@Entity('trip_members')
export class TripMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Veza ka planu
  @ManyToOne(() => TripPlanEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tripPlanId' })
  plan: TripPlanEntity;

  @Column({ type: 'uuid' })
  tripPlanId: string;

  // Veza ka korisniku
  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  korisnik: UserEntity;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 10, default: 'VIEWER' })
  uloga: string;

  @CreateDateColumn({ type: 'timestamptz' })
  kreirano: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  azurirano: Date;
}
