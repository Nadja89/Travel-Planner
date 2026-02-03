export class User {
  constructor(
    public id: string | null,
    public imePrezime: string,
    public email: string,
    public telefon: string | null,
    public korisnickoIme: string,
    public avatar: string | null,
    public lozinka: string,
  ) {}
}
