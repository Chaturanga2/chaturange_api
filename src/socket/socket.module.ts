import { Module } from '@nestjs/common';
import { ChatEvents } from './chatEvents';
import { GameEvents } from './gameEvents';
import { ChessGameService } from '../chess-game/chess-game.service';

@Module({
  providers: [ChatEvents, GameEvents, ChessGameService],
})
export class SocketModule {}
