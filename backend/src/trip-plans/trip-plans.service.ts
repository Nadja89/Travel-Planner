import { Injectable, Inject } from '@nestjs/common'; // Dodat Inject
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices'; // Dodat ClientProxy

import { TripPlanEntity } from './entities/trip-plan.entity';
import { CreateTripPlanDto } from './dto/create-trip-plan.dto';
import { UpdateTripPlanDto } from './dto/update-trip-plan.dto';

import { TripPlan } from '../domain/trip-plan';
import { TripPlanMapper } from '../mappers/trip-plan.mapper';

@Injectable()
export class TripPlansService {
  constructor(
    @InjectRepository(TripPlanEntity)
    private readonly repo: Repository<TripPlanEntity>,

    // Ubacujemo RabbitMQ klijenta registrovanog pod ovim imenom
    @Inject('COMM_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  // Čuvanje
  async create(dto: CreateTripPlanDto): Promise<TripPlan> {
    const business = new TripPlan(
      null,
      dto.naziv,
      dto.destinacija,
      dto.datumOd ?? null,
      dto.datumDo ?? null,
      dto.opis ?? null,
      dto.status ?? 'DRAFT',
      dto.kreatorId,
    );

    const entitet = TripPlanMapper.toEntity(business);
    const sacuvan = await this.repo.save(entitet);
    
    //Emitovanje poruke nakon uspesnog cuvanja u bazu
    const domenskiObjekat = TripPlanMapper.toDomain(sacuvan);
    this.client.emit('trip_plan_created', domenskiObjekat);

    return domenskiObjekat;
  }

  // Učitavanje svih
  async findAll(): Promise<TripPlan[]> {
    const entiteti = await this.repo.find();
    return entiteti.map(TripPlanMapper.toDomain);
  }

  // Učitavanje jednog
  async findOne(id: string): Promise<TripPlan | null> {
    const entitet = await this.repo.findOne({ where: { id } });
    return entitet ? TripPlanMapper.toDomain(entitet) : null;
  }

  // AŽURIRANJE
  async update(id: string, dto: UpdateTripPlanDto): Promise<TripPlan | null> {
    const entitet = await this.repo.findOne({ where: { id } });
    if (!entitet) return null;

    if (dto.naziv !== undefined) entitet.naziv = dto.naziv;
    if (dto.destinacija !== undefined) entitet.destinacija = dto.destinacija;
    if (dto.datumOd !== undefined) entitet.datumOd = dto.datumOd ?? null;
    if (dto.datumDo !== undefined) entitet.datumDo = dto.datumDo ?? null;
    if (dto.opis !== undefined) entitet.opis = dto.opis ?? null;
    if (dto.status !== undefined) entitet.status = dto.status;
    if (dto.kreatorId !== undefined) entitet.kreatorId = dto.kreatorId;

    const sacuvan = await this.repo.save(entitet);
    const domenskiObjekat = TripPlanMapper.toDomain(sacuvan);

    //Emitovanje poruke o azuriranju
    this.client.emit('trip_plan_updated', domenskiObjekat);

    return domenskiObjekat;
  }

  // Brisanje
  async remove(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    const obrisano = (result.affected ?? 0) > 0;

    if (obrisano) {
      // FAZA III: Obaveštavamo sistem da je plan obrisan
      this.client.emit('trip_plan_deleted', { id });
    }

    return obrisano;
  }
}