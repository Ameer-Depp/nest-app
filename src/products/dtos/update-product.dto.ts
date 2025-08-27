import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  Length,
  IsOptional,
} from 'class-validator';

export class UpdateProductDTO {
  @IsOptional()
  @IsString({ message: 'title should be string' })
  @IsNotEmpty({ message: 'title should not be empty' })
  @Length(2, 50, { message: 'title must be between 2 and 50 characters' })
  @ApiPropertyOptional()
  title?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'price should not be empty' })
  @IsNumber({}, { message: 'price must be a number' })
  @Min(0, { message: 'price should not be less than 0' })
  @ApiPropertyOptional()
  price?: number;

  @IsOptional()
  @IsString({ message: 'description should be string' })
  @IsNotEmpty({ message: 'description should not be empty' })
  @Length(1, 1000, {
    message: 'description must be between 1 and 1000 characters',
  })
  @ApiPropertyOptional()
  description?: string;
}
