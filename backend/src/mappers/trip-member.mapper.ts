import { TripMember } from '../domain/trip-member';
import { TripMemberEntity } from '../trip-members/entities/trip-member.entity';

export const TripMemberMapper = {

  toEntity(clan: TripMember): TripMemberEntity {
    const entitet = new TripMemberEntity();

    if (clan.id) {
      entitet.id = clan.id;
    }

    entitet.tripPlanId = clan.tripPlanId;
    entitet.userId = clan.userId;
    entitet.uloga = clan.uloga;

    return entitet;
  },

  toDomain(entitet: TripMemberEntity): TripMember {
    return new TripMember(
      entitet.id,
      entitet.tripPlanId,
      entitet.userId,
      entitet.uloga
    );
  }

};
