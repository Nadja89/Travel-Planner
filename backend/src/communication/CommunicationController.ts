import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TripLocksGateway } from 'src/trip-locks/trip-locks.gateway';

@Controller()
export class CommunicationController {
  
  constructor(private readonly gateway: TripLocksGateway) {}

  @EventPattern('trip_plan_created')
  handleTripPlanCreated(@Payload() data: any) {
    console.log('Primljen dogadjaj');
    console.log('Novi plan puta:', data);
  }

  @EventPattern('trip_plan_updated')
  handleTripPlanUpdated(@Payload() data: any) {
    console.log('Plan azuriran:', data);
  }

  @EventPattern('user_created')
  handleUserCreated(@Payload() data: any) {
    console.log(`Novi korisnik registrovan: ${data.imePrezime} (${data.email})`);
  }

  @EventPattern('user_deleted')
  handleUserDeleted(@Payload() data: any) {
    console.log(` Nalog korisnika ${data.userId} je obrisan iz sistema.`);
  }

  @EventPattern('member_added')
  handleMemberAdded(@Payload() data: any) {
    console.log(` Korisnik ${data.userId} je dodat na plan puta ${data.tripPlanId} sa ulogom ${data.uloga}.`);
  }

  @EventPattern('member_removed')
  handleMemberRemoved(@Payload() data: any) {
    console.log(` Clanstvo ${data.memberId} je ukinuto.`);
  }

  @EventPattern('trip_locked')
  handleTripLocked(@Payload() data: any) {
    console.log(` Plan puta ${data.tripPlanId} je zakljucao korisnik ${data.userId}.`);
    this.gateway.server.to(data.tripPlanId).emit('trip_locked', data);
  }

  @EventPattern('trip_unlocked')
  handleTripUnlocked(@Payload() data: any) {
    console.log(` Plan puta ${data.tripPlanId} je sada slobodan za izmene.`);
    this.gateway.server.to(data.tripPlanId).emit('trip_unlocked', data);
  }

  @EventPattern('activity_created')
  handleActivityCreated(@Payload() data: any) {
    console.log(`Nova aktivnost "${data.naziv}" (${data.kategorija}) dodata u plan ${data.tripPlanId}.`);
    this.gateway.server.to(data.tripPlanId).emit('activities_updated');
  }

  @EventPattern('activity_updated')
  handleActivityUpdated(@Payload() data: any) {
    console.log(`Aktivnost "${data.naziv}" je azurirana.`);
    this.gateway.server.to(data.tripPlanId).emit('activities_updated');
  }

  @EventPattern('activity_deleted')
  handleActivityDeleted(@Payload() data: any) {
    console.log(`Aktivnost obrisana iz plana ${data.tripPlanId}.`);
    this.gateway.server.to(data.tripPlanId).emit('activities_updated');
  }
  @EventPattern('trip_plan_deleted')
  handleTripPlanDeleted(@Payload() data: { id: string }) {
    console.log(`Plan puta sa ID-jem ${data.id} je trajno obrisan.`);
    this.gateway.server.to(data.id).emit('trip_deleted', { tripPlanId: data.id });
  }
}