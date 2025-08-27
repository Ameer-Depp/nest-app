import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @ApiProperty()
  userName: string;

  @IsEmail()
  @MaxLength(100)
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
