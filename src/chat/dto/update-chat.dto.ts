import { PartialType } from '@nestjs/mapped-types';
import { CreateChatDto } from './create-chat.dto';
import { Message } from '../chat.interface';

export class UpdateChatDto extends PartialType(CreateChatDto) {
  _id: string;
  message: Message;
}
