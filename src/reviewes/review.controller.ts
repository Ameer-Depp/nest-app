/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { Roles, RolesOrOwner } from 'src/users/decorators/roles.decorator';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { UserType } from 'src/users/user.entity';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { ApiSecurity } from '@nestjs/swagger';

@Controller('api/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserType.Admin, UserType.Normal_USER)
  @ApiSecurity('bearer')
  public createReview(
    @Body() body: CreateReviewDto,
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.reviewService.createReview(body, req.user.id, id);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiSecurity('bearer')
  public getAllReviews(
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('reviewPerPage', ParseIntPipe) reviewPerPage: number,
  ) {
    return this.reviewService.getAllReviews(pageNumber, reviewPerPage);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiSecurity('bearer')
  public getReviewById(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.getReviewById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiSecurity('bearer')
  updateReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateReviewDto,
    @Request() req: any,
  ) {
    return this.reviewService.updateReview(id, body, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @RolesOrOwner(UserType.Admin)
  @ApiSecurity('bearer')
  public async deleteReview(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    await this.reviewService.deleteReview(id, req.user.id);
    return { message: 'review deleted successfully' };
  }
}
