import { TripLock } from '../domain/trip-lock';
import { TripLockEntity } from '../trip-locks/entities/trip-lock.entity';

export const TripLockMapper = {

  toEntity(zakljucavanje: TripLock): TripLockEntity {
    const entitet = new TripLockEntity();

    if (zakljucavanje.id) {
      entitet.id = zakljucavanje.id;
    }

    entitet.tripPlanId = zakljucavanje.tripPlanId;
    entitet.userId = zakljucavanje.userId;

    return entitet;
  },

  toDomain(entitet: TripLockEntity): TripLock {
    return new TripLock(
      entitet.id,
      entitet.tripPlanId,
      entitet.userId,
      entitet.zakljucanoU
    );
  }

};

