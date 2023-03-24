import { Module } from "@nestjs/common"; 
import { ChatEvents } from "./chatEvents";
import { GameEvents } from "./gameEvents";

@Module({
    providers: [ChatEvents, GameEvents]
})

export class SocketModule {}