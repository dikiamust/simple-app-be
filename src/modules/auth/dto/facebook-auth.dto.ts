import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FacebookAuthDto {
  @ApiProperty()
  @IsString()
  idToken: string;
}
