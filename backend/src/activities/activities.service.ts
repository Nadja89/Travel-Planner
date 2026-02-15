import { Injectable, Inject } from '@nestjs/common'; // Dodat Inject
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices'; // Dodat ClientProxy

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

    @Inject('COMM_SERVICE')
    private readonly client: ClientProxy, 
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
    const domenskiObjekat = ActivityMapper.toDomain(sacuvan);

    //Emitovanje dogadjaja o novoj aktivnosti
    this.client.emit('activity_created', domenskiObjekat);

    return domenskiObjekat;
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
    const domenskiObjekat = ActivityMapper.toDomain(sacuvan);

    //Emitovanje obavestenja o izmeni aktivnosti
    this.client.emit('activity_updated', domenskiObjekat);

    return domenskiObjekat;
  }

  async remove(id: string): Promise<boolean> {
    const res = await this.repo.delete(id);
    const uspesno = (res.affected ?? 0) > 0;

    if (uspesno) {
      //Obavestenje o brisanju aktivnosti
      this.client.emit('activity_deleted', { activityId: id });
    }

    return uspesno;
  }
}