import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { Chat, ChatSchema } from './entities/chat.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Chat.name,
        schema: ChatSchema,
      },
    ]),
  ],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
