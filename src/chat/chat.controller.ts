import { Request } from 'express';
import { ChatService } from './chat.service';
import { Body, Controller, Get, Req, Post, Query } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('/api')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/viewMessages')
  async viewMessages(@Req() req: Request) {
    const userId = req.cookies['id'];
    return await this.chatService.findAll(userId);
  }

  @Get('/viewMessage')
  async viewMessage(@Query('room_id') roomId: string) {
    return await this.chatService.findOneByRoom(roomId);
  }

  @Post('/createMessage')
  async createMessage(@Body() createChatDto: CreateChatDto) {
    return await this.chatService.create(createChatDto);
  }
}
