export class TripLock {
  constructor(
    public id: string | null,
    public tripPlanId: string,
    public userId: string,
    public zakljucanoU: Date | null,
  ) {}
}
