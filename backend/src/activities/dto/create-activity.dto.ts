export class CreateActivityDto {
  naziv: string;
  kategorija: string;
  tripPlanId: string;

  datumVreme?: Date | null;
  opis?: string | null;
}
