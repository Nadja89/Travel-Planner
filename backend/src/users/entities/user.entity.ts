import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  imePrezime: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  telefon: string | null;

  @Column({ type: 'varchar', length: 50, unique: true })
  korisnickoIme: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string | null;

  @Column({ type: 'varchar', length: 100 })
  lozinka: string;

  @CreateDateColumn({ type: 'timestamptz' })
  kreirano: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  azurirano: Date;
}
