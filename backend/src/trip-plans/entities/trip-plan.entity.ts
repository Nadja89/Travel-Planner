import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('trip_plans')
export class TripPlanEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 80 })
  naziv: string;

  @Column({ type: 'varchar', length: 80 })
  destinacija: string;

  @Column({ type: 'date', nullable: true })
  datumOd: string | null;

  @Column({ type: 'date', nullable: true })
  datumDo: string | null;

  @Column({ type: 'text', nullable: true })
  opis: string | null;

  @Column({ type: 'varchar', length: 20, default: 'DRAFT' })
  status: string;

  
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'kreatorId' })
  kreator: UserEntity;

  @Column({ type: 'uuid' })
  kreatorId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  kreirano: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  azurirano: Date;
}
