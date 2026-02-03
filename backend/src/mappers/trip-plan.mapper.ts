import { TripPlan } from '../domain/trip-plan';
import { TripPlanEntity } from '../trip-plans/entities/trip-plan.entity';

export const TripPlanMapper = {

  toEntity(plan: TripPlan): TripPlanEntity {
    const entitet = new TripPlanEntity();

    if (plan.id) {
      entitet.id = plan.id;
    }

    entitet.naziv = plan.naziv;
    entitet.destinacija = plan.destinacija;
    entitet.datumOd = plan.datumOd ?? null;
    entitet.datumDo = plan.datumDo ?? null;
    entitet.opis = plan.opis ?? null;

    entitet.status = plan.status;
    entitet.kreatorId = plan.kreatorId;

    return entitet;
  },

  toDomain(entitet: TripPlanEntity): TripPlan {
    return new TripPlan(
      entitet.id,
      entitet.naziv,
      entitet.destinacija,
      entitet.datumOd ?? null,
      entitet.datumDo ?? null,
      entitet.opis ?? null,
      entitet.status,
      entitet.kreatorId
    );
  }

};
