import { Injectable } from '@nestjs/common';
import { TripLocksGateway } from './trip-locks.gateway';

@Injectable()
export class TripLocksService {
  constructor(private readonly gateway: TripLocksGateway) {}

  tryLock(tripPlanId: string, userId: string): { success: boolean; lockedBy?: string } {
    const lockedBy = this.gateway.getLock(tripPlanId);
    if (lockedBy && lockedBy !== userId) return { success: false, lockedBy };
    this.gateway.handleLockTrip({ tripPlanId, userId });
    return { success: true };
  }

  unlock(tripPlanId: string, userId: string) {
    this.gateway.handleUnlockTrip({ tripPlanId, userId });
  }
}