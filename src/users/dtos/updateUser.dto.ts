import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class updateUserDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  userName: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  @IsNotEmpty()
  email: string;
}
