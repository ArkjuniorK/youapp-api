import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@WebSocketGateway(8081, { transports: ['websocket'] })
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('createChat')
  create(@MessageBody() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @SubscribeMessage('findAllChat')
  findAll(@MessageBody() user_id: string) {
    return this.chatService.findAll(user_id);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: string) {
    return this.chatService.remove(id);
  }

  @SubscribeMessage('viewMessages')
  findOne(@MessageBody() id: string) {
    return this.chatService.findOne(id);
  }

  @SubscribeMessage('sendMessage')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto._id, updateChatDto);
  }
}
