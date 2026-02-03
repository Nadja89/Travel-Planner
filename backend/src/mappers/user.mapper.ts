import { User } from '../domain/user';
import { UserEntity } from '../users/entities/user.entity';

export const UserMapper = {
  toEntity(korisnik: User): UserEntity {
    const entitet = new UserEntity();

    if (korisnik.id) entitet.id = korisnik.id;

    entitet.imePrezime = korisnik.imePrezime;
    entitet.email = korisnik.email;
    entitet.telefon = korisnik.telefon ?? null;
    entitet.korisnickoIme = korisnik.korisnickoIme;
    entitet.avatar = korisnik.avatar ?? null;
    entitet.lozinka = korisnik.lozinka;

    return entitet;
  },

  toDomain(entitet: UserEntity): User {
    return new User(
      entitet.id,
      entitet.imePrezime,
      entitet.email,
      entitet.telefon ?? null,
      entitet.korisnickoIme,
      entitet.avatar ?? null,
      entitet.lozinka,
    );
  },
};
