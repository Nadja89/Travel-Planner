import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class TripLocksGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;


  private locks: Record<string, string> = {};

  afterInit(server: Server) {
    console.log('TripLocksGateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    
  }

  @SubscribeMessage('join_trip')
  handleJoinTrip(@MessageBody() tripPlanId: string, @ConnectedSocket() client: Socket) {
    client.join(tripPlanId);
    if (this.locks[tripPlanId]) {
      client.emit('trip_locked', { tripPlanId, userId: this.locks[tripPlanId] });
    }
  }

  @SubscribeMessage('lock_trip')
  handleLockTrip(@MessageBody() data: { tripPlanId: string; userId: string }) {
    const { tripPlanId, userId } = data;
    const lockedBy = this.locks[tripPlanId];

    if (lockedBy && lockedBy !== userId) {
      return { success: false, lockedBy };
    }

    this.locks[tripPlanId] = userId;
    this.server.to(tripPlanId).emit('trip_locked', { tripPlanId, userId });
    return { success: true };
  }

  @SubscribeMessage('unlock_trip')
  handleUnlockTrip(@MessageBody() data: { tripPlanId: string; userId: string }) {
    const { tripPlanId, userId } = data;
    if (this.locks[tripPlanId] === userId) {
      delete this.locks[tripPlanId];
      this.server.to(tripPlanId).emit('trip_unlocked', { tripPlanId });
    }
  }

  getLock(tripPlanId: string): string | undefined {
    return this.locks[tripPlanId];
  }
}