export class CreateUserDto {
  imePrezime: string;
  email: string;
  korisnickoIme: string;
  lozinka: string;
  telefon?: string | null;
  avatar?: string | null;
}
