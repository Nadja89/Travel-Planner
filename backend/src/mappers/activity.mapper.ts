import { Activity } from '../domain/activity';
import { ActivityEntity } from '../activities/entities/activity.entity';

export const ActivityMapper = {

  toEntity(aktivnost: Activity): ActivityEntity {
    const entitet = new ActivityEntity();

    if (aktivnost.id) {
      entitet.id = aktivnost.id;
    }

    entitet.naziv = aktivnost.naziv;
    entitet.kategorija = aktivnost.kategorija;
    entitet.datumVreme = aktivnost.datumVreme ?? null;
    entitet.opis = aktivnost.opis ?? null;
    entitet.tripPlanId = aktivnost.tripPlanId;

    return entitet;
  },

  toDomain(entitet: ActivityEntity): Activity {
    return new Activity(
      entitet.id,
      entitet.naziv,
      entitet.kategorija,
      entitet.datumVreme ?? null,
      entitet.opis ?? null,
      entitet.tripPlanId
    );
  }

};
