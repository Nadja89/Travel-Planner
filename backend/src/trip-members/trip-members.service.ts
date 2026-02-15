import { Injectable, Inject } from '@nestjs/common'; // Dodat Inject
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices'; // Dodat ClientProxy

import { TripMemberEntity } from './entities/trip-member.entity';
import { CreateTripMemberDto } from './dto/create-trip-member.dto';

import { TripMember } from '../domain/trip-member';
import { TripMemberMapper } from '../mappers/trip-member.mapper';

@Injectable()
export class TripMembersService {
  constructor(
    @InjectRepository(TripMemberEntity)
    private readonly repo: Repository<TripMemberEntity>,
    
    @Inject('COMM_SERVICE') 
    private readonly client: ClientProxy, 
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
    
    const domenskiObjekat = TripMemberMapper.toDomain(saved);

    //Obavestavanje da je novi clan dodat na plan puta
    this.client.emit('member_added', domenskiObjekat);

    return domenskiObjekat;
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
    const uspesno = (res.affected ?? 0) > 0;

    if (uspesno) {
      //Obavestavanje da je clan uklonjen
      this.client.emit('member_removed', { memberId: id });
    }

    return uspesno;
  }
}