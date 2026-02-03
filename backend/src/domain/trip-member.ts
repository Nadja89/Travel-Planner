export class TripMember {
  constructor(
    public id: string | null,
    public tripPlanId: string,
    public userId: string,
    public uloga: string, 
  ) {}
}
