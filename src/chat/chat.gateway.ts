import {
  WebSocketGateway,
  OnGatewayConnection,
  SubscribeMessage,
  OnGatewayDisconnect,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { ChatPaylod } from './chat.interface';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}

  private readonly logger = new Logger(ChatGateway.name);
  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const { sockets } = this.io.sockets;

    const userId = client.handshake.headers['user-id'];
    if (!userId) {
      return new Error('User Id is not specified');
    }

    const chats = await this.chatService.findAll(userId as string);
    for (const chat of chats) {
      client.join(chat.room_id.toString());
    }

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage('ping')
  handleMessage(client: any, msg: any) {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${msg}`);

    const data = {
      event: 'pong',
      data: 'hello from pong',
    };

    this.io.emit('ping', data);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, data: ChatPaylod) {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);

    const roomId = data.room_id;
    const chat = await this.chatService.findOneByRoom(roomId);

    chat.messages.push(data.message);
    await chat.save();

    this.io.to(roomId).emit('sendMessage', data.message);
  }
}
