import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
  ) {}

  // Ćuvanje
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
    return TripPlanMapper.toDomain(sacuvan);
  }

  // Učitavanje svih
  async findAll(): Promise<TripPlan[]> {
    const entiteti = await this.repo.find();
    return entiteti.map(TripPlanMapper.toDomain);
  }

  // učitavanje jednog
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
    return TripPlanMapper.toDomain(sacuvan);
  }

  // Brisanje
  async remove(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

