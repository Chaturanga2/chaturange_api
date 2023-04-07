// gameEvents.ts
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChessGameService } from '../chess-game/chess-game.service';
import { CellType } from '../types/chess.types';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameEvents {
  constructor(private readonly chessGameService: ChessGameService) {}
  @WebSocketServer()
  server: Server;

  // constructor(private chessGameService: ChessGameService) {}
  // constructor(private readonly chessGameService: ChessGameService) {}

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

  // Get movePiece event from client and send to client boolean if move is valid
  @SubscribeMessage('movePiece')
  handleMovePiece(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    // console.log('Move piece data received:', pieceName);

    // Check if move is valid
    const { pieceName, board, oldCell, newCell, currentPlayer } = body;
    const piece = this.chessGameService.movePieces(
      pieceName,
      board,
      oldCell,
      newCell,
      currentPlayer,
    );

    // Send boolean to client
    this.server.emit('movePiece', piece);
  }

  private connectedUsers: { [id: string]: { id: string; pseudo: string } } = {};

  login(client: Socket, username: string, userId: string) {
    // After successful authentication
    const socket = this.connectedUsers[userId];
    if (socket) {
      // If user is already connected, emit a message to inform the user
      // that they have been disconnected from another device.
      client.emit(
        'force-logout',
        'You have been logged out from another device.',
      );
      client.disconnect();
    }

    // Create a new socket and store the ID and username of the user.
    const newSocket = this.server.emit(client.id);
    console.log('newSocket', client.id);
    console.log('newSocket', this.server.sockets.sockets[client.id]);
    if (newSocket) {
      this.connectedUsers[userId] = {
        id: userId,
        pseudo: username,
      };
    }
  }

  logout(client: Socket, userId: string) {
    // After successful authentication
    const connectedSockets = Object.keys(this.connectedUsers);
    console.log('socketId', connectedSockets);
    connectedSockets.map((socketId) => {
      if (socketId === userId) {
        this.connectedUsers[socketId] = null;
        delete this.connectedUsers[socketId];
      }
    });
  }

  // Get users from socket


  @SubscribeMessage('setAuthUser')
  handleConnexion(
    @MessageBody() user: { userId: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Position data received:', user);

    this.login(client, user.username, user.userId);
    this.server.emit('setAuthUser', user);
  }

  @SubscribeMessage('logoutUser')
  handleLogout(
    @MessageBody() user: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Position data received:', user);

    this.logout(client, user.userId);
    this.server.emit('logoutUser', user);
  }

  @SubscribeMessage('getAuthUser')
  getAuthUsers(@ConnectedSocket() client: Socket) {
    const connectedSockets = Object.keys(this.connectedUsers);
    console.log('socketId', connectedSockets);
    const users = connectedSockets.map((socketId) => {
      return this.connectedUsers[socketId];
    });
    this.server.emit('getAuthUser', users);
  }
}
