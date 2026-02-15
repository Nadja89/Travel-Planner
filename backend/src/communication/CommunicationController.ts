import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class CommunicationController {
  
  
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
  }

  @EventPattern('trip_unlocked')
  handleTripUnlocked(@Payload() data: any) {
    console.log(` Plan puta ${data.tripPlanId} je sada slobodan za izmene.`);
  }

@EventPattern('activity_created')
  handleActivityCreated(@Payload() data: any) {
    console.log(`Nova aktivnost "${data.naziv}" (${data.kategorija}) dodata u plan ${data.tripPlanId}.`);
  }

  @EventPattern('activity_updated')
  handleActivityUpdated(@Payload() data: any) {
    console.log(`Aktivnost "${data.naziv}" je azurirana.`);
  }
}