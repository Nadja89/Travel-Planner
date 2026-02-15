import { Injectable, Inject } from '@nestjs/common'; // Dodat Inject
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices'; // Dodat ClientProxy

import { TripLockEntity } from './entities/trip-lock.entity';
import { CreateTripLockDto } from './dto/create-trip-lock.dto';

import { TripLock } from '../domain/trip-lock';
import { TripLockMapper } from '../mappers/trip-lock.mapper';

@Injectable()
export class TripLocksService {
  constructor(
    @InjectRepository(TripLockEntity)
    private readonly repo: Repository<TripLockEntity>,
    
    @Inject('COMM_SERVICE') 
    private readonly client: ClientProxy, 
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
    
    const domenskiObjekat = TripLockMapper.toDomain(saved);

    //Obavestavamo ostale da je plan "zakljucan" 
    this.client.emit('trip_locked', domenskiObjekat);

    return domenskiObjekat;
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
    // Pre brisanja nalazimo lock da bismo znali koji je plan u pitanju
    const entitet = await this.repo.findOne({ where: { id } });
    
    const res = await this.repo.delete(id);
    const uspesno = (res.affected ?? 0) > 0;

    if (uspesno && entitet) {
      //Obavestavamo da je plan "otkljucan" 
      this.client.emit('trip_unlocked', { tripPlanId: entitet.tripPlanId });
    }

    return uspesno;
  }
}