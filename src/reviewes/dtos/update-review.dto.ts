import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  Length,
  Max,
  IsOptional,
} from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'rating must be at least 1' })
  @Max(5, { message: 'rating must not be more than 5' })
  rating: number;

  @IsOptional()
  @IsString({ message: 'review should be string' })
  @IsNotEmpty()
  @Length(1, 1000)
  review;
}
