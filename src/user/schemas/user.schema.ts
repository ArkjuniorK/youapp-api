import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  displayName: string;

  @Prop()
  birthday: Date;

  @Prop()
  weight: string;

  @Prop()
  height: string;

  @Prop()
  horoscope: string;

  @Prop()
  zodiac: string;

  @Prop()
  photo: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
