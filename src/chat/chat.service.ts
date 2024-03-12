import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat } from './entities/chat.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name)
    private chatModel: Model<Chat>,
  ) {}

  async create(createChatDto: CreateChatDto) {
    if (createChatDto.user_ids.length !== 2) {
      return 'bad request';
    }

    const isExists = await this.chatModel.exists({
      user_ids: createChatDto.user_ids,
    });

    if (isExists) {
      return { msg: 'chat already exists' };
    }

    const chat = { room_id: new Types.ObjectId(), ...createChatDto };
    return await this.chatModel.create(chat);
  }

  async findAll(user_id: string) {
    return await this.chatModel.find(
      { user_ids: { $in: user_id } },
      { messages: 0 },
    );
  }

  findOne(id: string) {
    return this.chatModel.findById(id);
  }

  async findOneByRoom(roomId: string) {
    return await this.chatModel.findOne({
      room_id: new Types.ObjectId(roomId),
    });
  }

  remove(id: string) {
    return this.chatModel.findByIdAndDelete(id);
  }
}
