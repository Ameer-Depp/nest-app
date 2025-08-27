import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  Length,
  Max,
} from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'rating must be at least 1' })
  @Max(5, { message: 'rating must not be more than 5' })
  @ApiProperty()
  rating: number;

  @IsString({ message: 'review should be string' })
  @IsNotEmpty()
  @Length(1, 1000)
  @ApiProperty()
  review: string;
}
