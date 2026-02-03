import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TripPlanEntity } from '../../trip-plans/entities/trip-plan.entity';

@Entity('activities')
export class ActivityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 80 })
  naziv: string;

  @Column({ type: 'varchar', length: 30 })
  kategorija: string;

  @Column({ type: 'timestamptz', nullable: true })
  datumVreme: Date | null;

  @Column({ type: 'text', nullable: true })
  opis: string | null;

  // Veza ka planu
  @ManyToOne(() => TripPlanEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tripPlanId' })
  plan: TripPlanEntity;

  @Column({ type: 'uuid' })
  tripPlanId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  kreirano: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  azurirano: Date;
}
