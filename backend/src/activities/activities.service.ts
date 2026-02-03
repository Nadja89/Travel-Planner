import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ActivityEntity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

import { Activity } from '../domain/activity';
import { ActivityMapper } from '../mappers/activity.mapper';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(ActivityEntity)
    private readonly repo: Repository<ActivityEntity>,
  ) {}

  async create(dto: CreateActivityDto): Promise<Activity> {
    const business = new Activity(
      null,
      dto.naziv,
      dto.kategorija,
      dto.datumVreme ?? null,
      dto.opis ?? null,
      dto.tripPlanId,
    );

    const entitet = ActivityMapper.toEntity(business);
    const sacuvan = await this.repo.save(entitet);
    return ActivityMapper.toDomain(sacuvan);
  }

  async findAll(): Promise<Activity[]> {
    const entiteti = await this.repo.find();
    return entiteti.map(ActivityMapper.toDomain);
  }

  async findOne(id: string): Promise<Activity | null> {
    const entitet = await this.repo.findOne({ where: { id } });
    return entitet ? ActivityMapper.toDomain(entitet) : null;
  }

  async update(id: string, dto: UpdateActivityDto): Promise<Activity | null> {
    const entitet = await this.repo.findOne({ where: { id } });
    if (!entitet) return null;

    if (dto.naziv !== undefined) entitet.naziv = dto.naziv;
    if (dto.kategorija !== undefined) entitet.kategorija = dto.kategorija;
    if (dto.datumVreme !== undefined) entitet.datumVreme = dto.datumVreme ?? null;
    if (dto.opis !== undefined) entitet.opis = dto.opis ?? null;
    if (dto.tripPlanId !== undefined) entitet.tripPlanId = dto.tripPlanId;

    const sacuvan = await this.repo.save(entitet);
    return ActivityMapper.toDomain(sacuvan);
  }

  async remove(id: string): Promise<boolean> {
    const res = await this.repo.delete(id);
    return (res.affected ?? 0) > 0;
  }
}
