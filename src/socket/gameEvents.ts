// gameEvents.ts
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameEvents {
  @WebSocketServer()
  server: Server;

  // Connexion
  handleConnection(client: Socket) {
    console.log(`Client connected to gameEvent: ${client.id}`);
  }

  // Déconnexion
  handleDisconnection(client: Socket) {
    console.log(`Client disconnected to gameEvent: ${client.id}`);
  }

  // Recevoir un message (s'abonner à un message)
  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    // Envoyer un event
    this.server.emit('message', client.id, data);
  }

  // Gérer l'événement "move" pour les positions des pions
  @SubscribeMessage('move')
  handleMove(
    @MessageBody() positionData: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Position data received:', positionData);

    // Diffuser l'événement "move" à tous les clients connectés
    this.server.emit('move', positionData);
  }
}
