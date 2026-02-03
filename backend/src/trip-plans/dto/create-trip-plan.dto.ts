export class CreateTripPlanDto {
  naziv: string;
  destinacija: string;
  kreatorId: string;

  datumOd?: string | null;
  datumDo?: string | null;
  opis?: string | null;
  status?: string;
}
