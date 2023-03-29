import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ 
    cors: {
        origin: '*'
    }
})

export class GameEvents {
    @WebSocketServer()
    server: Server

    //connexion
    handleConnection(client: Socket) {
        console.log(`Client connected to gameEvent: ${client.id}`)
    }
    
    //déconnexion
    handleDisconnection(client: Socket) {
        console.log(`Client disconnected to gameEvent: ${client.id}`)
    }

    //recevoir un message (s'abonner à un message)
    @SubscribeMessage('message')
    handleEvent(@MessageBody() data: string, @ConnectedSocket() client : Socket) {
        //envoyer un event
        this.server.emit('message', client.id, data)
    } 
}