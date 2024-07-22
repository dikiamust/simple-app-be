import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class BaseReqQuery {
  @ApiProperty({
    required: false,
    enum: ['ASC'],
    example: 'ASC',
  })
  @IsOptional()
  @IsString()
  sortingType?: 'ASC';

  @ApiProperty({
    required: false,
    enum: ['name', 'createdAt', 'endDate'],
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortingBy?: 'name' | 'createdAt' | 'endDate';

  @ApiProperty({
    required: false,
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumberString()
  page?: number;

  @ApiProperty({
    required: false,
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @ApiProperty({
    required: false,
    example: 'John',
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  keyword?: string;
}
