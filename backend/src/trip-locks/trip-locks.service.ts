import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TripLockEntity } from './entities/trip-lock.entity';
import { CreateTripLockDto } from './dto/create-trip-lock.dto';

import { TripLock } from '../domain/trip-lock';
import { TripLockMapper } from '../mappers/trip-lock.mapper';

@Injectable()
export class TripLocksService {
  constructor(
    @InjectRepository(TripLockEntity)
    private readonly repo: Repository<TripLockEntity>,
  ) {}

  async create(dto: CreateTripLockDto): Promise<TripLock> {
    const business = new TripLock(
      null,
      dto.tripPlanId,
      dto.userId,
      null,
    );

    const entitet = TripLockMapper.toEntity(business);
    const saved = await this.repo.save(entitet);
    return TripLockMapper.toDomain(saved);
  }

  async findAll(): Promise<TripLock[]> {
    const list = await this.repo.find();
    return list.map(TripLockMapper.toDomain);
  }

  async findOne(id: string): Promise<TripLock | null> {
    const entitet = await this.repo.findOne({ where: { id } });
    return entitet ? TripLockMapper.toDomain(entitet) : null;
  }

  async remove(id: string): Promise<boolean> {
    const res = await this.repo.delete(id);
    return (res.affected ?? 0) > 0;
  }
}

