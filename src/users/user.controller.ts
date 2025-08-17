import { Controller, Get } from '@nestjs/common';

@Controller()
export class UserController {
  // GET http://localhost:3000/api/users
  @Get('api/users')
  getAllReviews() {
    return [
      { id: 1, userName: 'ameer', email: 'ameer@gmail.com', password: '12345' },
      { id: 2, userName: 'kevin', email: 'kevin@gmail.com', password: '12345' },
      { id: 3, userName: 'jo', email: 'jo@gmail.com', password: '12345' },
    ];
  }
}
