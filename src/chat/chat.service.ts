import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name)
    private chatModel: Model<Chat>,
  ) {}

  create(createChatDto: CreateChatDto) {
    if (createChatDto.user_ids.length !== 2) {
      return 'bad request';
    }

    const isExists = this.chatModel.exists({
      user_ids: createChatDto.user_ids,
    });

    if (!isExists) {
      return this.chatModel.create(createChatDto);
    }

    return 'chat already exists';
  }

  findAll(user_id: string) {
    return this.chatModel.find({ user_ids: { $in: user_id } }, { messages: 0 });
  }

  findOne(id: string) {
    return this.chatModel.findById(id);
  }

  update(id: string, updateChatDto: UpdateChatDto) {
    return this.chatModel.findOneAndUpdate(
      { _id: id },
      { $set: { messages: { $push: updateChatDto.message } } },
    );
  }

  remove(id: string) {
    return this.chatModel.findByIdAndDelete(id);
  }
}
