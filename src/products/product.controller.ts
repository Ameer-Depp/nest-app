import { Controller, Get } from '@nestjs/common';

@Controller()
export class ProductController {
  // GET http://localhost:3000/api/products
  @Get('api/products')
  public getAllProducts() {
    return [
      { id: 1, title: 'book', price: 12 },
      { id: 2, title: 'PC', price: 1200 },
      { id: 3, title: 'laptop', price: 500 },
    ];
  }
}
