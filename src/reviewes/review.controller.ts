import { Controller, Get } from '@nestjs/common';

@Controller()
export class ReviewController {
  // GET http://localhost:3000/api/reviews
  @Get('api/reviews')
  getAllReviews() {
    return [
      { id: 1, rating: 4, title: 'good' },
      { id: 2, rating: 1, title: 'bad' },
      { id: 3, rating: 5, title: 'very good' },
    ];
  }
}
