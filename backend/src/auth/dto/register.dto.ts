import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongP@ss123', description: 'Password' })
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, and number or special character',
  })
  password: string;
}
