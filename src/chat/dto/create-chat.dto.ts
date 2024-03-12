import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @ApiProperty()
  @IsNotEmpty()
  user_ids: Array<string>;
}
