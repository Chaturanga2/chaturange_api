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
}
