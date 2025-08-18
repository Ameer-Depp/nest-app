/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNumber, IsNotEmpty, Min, Length } from 'class-validator';

export class CreateProductDTO {
  @IsString({ message: 'title should be string' })
  @IsNotEmpty()
  @Length(2, 50)
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'price should not be less than 0' })
  price: number;

  @IsString({ message: 'description should be string' })
  @IsNotEmpty()
  @Length(1, 1000)
  description;
}
