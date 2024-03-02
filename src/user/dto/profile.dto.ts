import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty({ required: false })
  displayName?: string;

  @ApiProperty({ required: false })
  birthday?: Date;

  @ApiProperty({ enum: ['male', 'female'], required: false })
  gender: string;

  @ApiProperty({ required: false })
  weight?: string;

  @ApiProperty({ required: false })
  height?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', required: false })
  photo?: string;
}
