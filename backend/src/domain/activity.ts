export class Activity {
  constructor(
    public id: string | null,
    public naziv: string,
    public kategorija: string,
    public datumVreme: Date | null,
    public opis: string | null,
    public tripPlanId: string,
  ) {}
}
