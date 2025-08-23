import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class ProductFiltersDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @IsOptional()
  @IsNumberString()
  maxPrice?: string;
}
