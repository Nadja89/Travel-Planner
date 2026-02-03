import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    return UserMapper.toDomain(sacuvan);
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
    return UserMapper.toDomain(sacuvan);
  }

  async remove(id: string): Promise<boolean> {
    const res = await this.repo.delete(id);
    return (res.affected ?? 0) > 0;
  }
}
