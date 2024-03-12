import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Message } from '../chat.interface';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop({ type: SchemaTypes.ObjectId })
  room_id: Types.ObjectId;

  @Prop()
  user_ids: Array<string>;

  @Prop()
  messages: Array<Message>;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
