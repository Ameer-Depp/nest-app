/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from '../reviewes/dtos/create-review.dto';
import { UpdateReviewDto } from '../reviewes/dtos/update-review.dto';
import { Repository } from 'typeorm';
import { Review } from '../reviewes/review.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  /**
   *  CREATE A REVIEW
   */
  public createReview(dto: CreateReviewDto) {
    const review = this.reviewRepository.create(dto);
    return this.reviewRepository.save(review);
  }

  /**
   *  GET ALL REVIEW
   */
  public getAllReviews() {
    return this.reviewRepository.find();
  }

  /**
   *  GET ONE REVIEW
   */
  public getReviewById(id: number) {
    const review = this.reviewRepository.findOne({ where: { id } });
    return review;
  }

  public async updateReview(id: number, dto: UpdateReviewDto) {
    const review = await this.getReviewById(id);

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    review.rating = dto.rating ?? review.rating;
    review.review = dto.review ?? review.review;

    return this.reviewRepository.save(review);
  }

  public async deleteReview(id: number) {
    const review = await this.getReviewById(id);

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    await this.reviewRepository.remove(review);
  }
}
