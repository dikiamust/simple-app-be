import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  confirmNewPassword: string;
}
