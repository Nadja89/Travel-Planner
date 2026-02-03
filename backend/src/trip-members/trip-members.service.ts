import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TripMemberEntity } from './entities/trip-member.entity';
import { CreateTripMemberDto } from './dto/create-trip-member.dto';

import { TripMember } from '../domain/trip-member';
import { TripMemberMapper } from '../mappers/trip-member.mapper';



@Injectable()
export class TripMembersService {
  constructor(
    @InjectRepository(TripMemberEntity)
    private readonly repo: Repository<TripMemberEntity>,
  ) {}

  async create(dto: CreateTripMemberDto): Promise<TripMember> {
    const business = new TripMember(
      null,
      dto.tripPlanId,
      dto.userId,
      dto.uloga ?? 'VIEWER',
    );

    const entitet = TripMemberMapper.toEntity(business);
    const saved = await this.repo.save(entitet);
    return TripMemberMapper.toDomain(saved);
  }

  async findAll(): Promise<TripMember[]> {
    const list = await this.repo.find();
    return list.map(TripMemberMapper.toDomain);
  }

  async findOne(id: string): Promise<TripMember | null> {
    const entitet = await this.repo.findOne({ where: { id } });
    return entitet ? TripMemberMapper.toDomain(entitet) : null;
  }

  async remove(id: string): Promise<boolean> {
    const res = await this.repo.delete(id);
    return (res.affected ?? 0) > 0;
  }
}

