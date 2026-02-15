import { Injectable, Inject } from '@nestjs/common'; // Dodat Inject
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices'; // Dodat ClientProxy

import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from '../domain/user';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
    
    @Inject('COMM_SERVICE') 
    private readonly client: ClientProxy, 
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const business = new User(
      null,
      dto.imePrezime,
      dto.email,
      dto.telefon ?? null,
      dto.korisnickoIme,
      dto.avatar ?? null,
      dto.lozinka,
    );

    const entitet = UserMapper.toEntity(business);
    const sacuvan = await this.repo.save(entitet);
    
    const domenskiObjekat = UserMapper.toDomain(sacuvan);
    
    //Obavestenje o registraciji novog korisnika
    this.client.emit('user_created', domenskiObjekat);
    
    return domenskiObjekat;
  }

  async findAll(): Promise<User[]> {
    const entiteti = await this.repo.find();
    return entiteti.map(UserMapper.toDomain);
  }

  async findOne(id: string): Promise<User | null> {
    const entitet = await this.repo.findOne({ where: { id } });
    return entitet ? UserMapper.toDomain(entitet) : null;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User | null> {
    const entitet = await this.repo.findOne({ where: { id } });
    if (!entitet) return null;

    if (dto.imePrezime !== undefined) entitet.imePrezime = dto.imePrezime;
    if (dto.email !== undefined) entitet.email = dto.email;
    if (dto.telefon !== undefined) entitet.telefon = dto.telefon ?? null;
    if (dto.korisnickoIme !== undefined) entitet.korisnickoIme = dto.korisnickoIme;
    if (dto.avatar !== undefined) entitet.avatar = dto.avatar ?? null;
    if (dto.lozinka !== undefined) entitet.lozinka = dto.lozinka;

    const sacuvan = await this.repo.save(entitet);
    const domenskiObjekat = UserMapper.toDomain(sacuvan);
    
    //Obavestenje o azuriranju profila
    this.client.emit('user_updated', domenskiObjekat);
    
    return domenskiObjekat;
  }

  async remove(id: string): Promise<boolean> {
    const res = await this.repo.delete(id);
    const uspesno = (res.affected ?? 0) > 0;
    
    if (uspesno) {
      //Obavestenje o brisanju naloga
      this.client.emit('user_deleted', { userId: id });
    }
    
    return uspesno;
  }
}