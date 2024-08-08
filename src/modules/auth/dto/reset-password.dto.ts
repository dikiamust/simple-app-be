import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\x20-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]{8,16}$/,
    {
      message:
        'Password must contain at least one lower character, one upper character, one digit character, one special character and 8 characters long',
    },
  )
  newPassword: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  confirmNewPassword: string;
}
