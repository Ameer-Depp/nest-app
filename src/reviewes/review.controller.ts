import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';

@Controller('api/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  public createReview(@Body() body: CreateReviewDto) {
    return this.reviewService.createReview(body);
  }

  @Get()
  public getAllReviews() {
    return this.reviewService.getAllReviews();
  }

  @Get(':id')
  public getReviewById(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.getReviewById(id);
  }

  @Put(':id')
  public updateReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateReviewDto,
  ) {
    return this.reviewService.updateReview(id, body);
  }

  @Delete(':id')
  public async deleteReview(@Param('id', ParseIntPipe) id: number) {
    await this.reviewService.deleteReview(id);
    return { message: 'review deleted successfully' };
  }
}
