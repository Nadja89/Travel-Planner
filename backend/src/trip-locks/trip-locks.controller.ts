import { Controller, Post, Body, Delete } from '@nestjs/common';
import { TripLocksService } from './trip-locks.service';

@Controller('trip-locks')
export class TripLocksController {
  constructor(private readonly service: TripLocksService) {}

  @Post()
  lockTrip(@Body() body: { tripPlanId: string; userId: string }) {
    const result = this.service.tryLock(body.tripPlanId, body.userId);
    if (!result.success) return { success: false, lockedBy: result.lockedBy };
    return { success: true, message: 'Zaključano' };
  }

  @Delete()
  unlockTrip(@Body() body: { tripPlanId: string; userId: string }) {
    this.service.unlock(body.tripPlanId, body.userId);
    return { message: 'Otključano' };
  }
}