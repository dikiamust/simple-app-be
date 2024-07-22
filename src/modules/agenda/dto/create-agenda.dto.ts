import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgendaDto {
  @ApiProperty({ example: 'Team Meeting' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '2024-07-23T09:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  startDateTime: Date;

  @ApiProperty({ example: '2024-07-23T10:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  endDateTime: Date;

  @ApiProperty({ example: [1, 2, 3] })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  assignedUser: number[];
}

export class UpdateAgendaDto extends CreateAgendaDto {}
