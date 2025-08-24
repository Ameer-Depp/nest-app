/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from '../reviewes/dtos/create-review.dto';
import { UpdateReviewDto } from '../reviewes/dtos/update-review.dto';
import { Repository } from 'typeorm';
import { Review } from '../reviewes/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from 'src/products/product.service';
import { UserService } from 'src/users/user.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) {}

  /**
   * CREATE NEW REVIEW
   * @param dto
   * @param userId
   * @param productId
   * @returns created review from the database
   */
  public async createReview(
    dto: CreateReviewDto,
    userId: number,
    productId: number,
  ) {
    const user = await this.userService.getUserProfile(userId);
    const product = await this.productService.getOneProductById(productId);

    const review = this.reviewRepository.create({
      ...dto,
      user,
      product,
    });
    const result = await this.reviewRepository.save(review);
    return {
      id: result.id,
      review: result.review,
      rating: result.rating,
      userId: user.id,
      productId: result.id,
    };
  }

  /**
   *  GET ALL REVIEW
   */
  public getAllReviews(pageNumber: number, reviewPerPage: number) {
    return this.reviewRepository.find({
      skip: reviewPerPage * (pageNumber - 1),
      take: reviewPerPage,
      relations: { user: true, product: true },
    });
  }

  /**
   *  GET ONE REVIEW
   */
  public getReviewById(id: number) {
    return this.reviewRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  public async updateReview(id: number, dto: UpdateReviewDto, userId: number) {
    const review = await this.getReviewById(id);

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    if (review.user.id !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    review.rating = dto.rating ?? review.rating;
    review.review = dto.review ?? review.review;

    return this.reviewRepository.save(review);
  }

  public async deleteReview(id: number, userId: number) {
    const review = await this.getReviewById(id);

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    if (review.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewRepository.remove(review);
  }
}
