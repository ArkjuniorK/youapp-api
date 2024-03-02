import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Message } from '../chat.interface';
import { HydratedDocument } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop()
  user_ids: Array<string>;

  @Prop()
  messages: Array<Message>;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
