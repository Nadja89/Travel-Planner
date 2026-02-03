export class TripPlan {
  constructor(
    public id: string | null,
    public naziv: string,
    public destinacija: string,
    public datumOd: string | null,
    public datumDo: string | null,
    public opis: string | null,
    public status: string,
    public kreatorId: string,
  ) {}
}
