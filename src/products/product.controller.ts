// product.controller.ts
import { Body, Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { CreateProductDTO } from './dtos/create-product.dto';

type ProductType = { id: number; title: string; price: number };

@Controller('api/products')
export class ProductController {
  // array of objects
  private products: ProductType[] = [
    { id: 1, title: 'book', price: 12 },
    { id: 2, title: 'PC', price: 1200 },
    { id: 3, title: 'laptop', price: 500 },
  ];

  // POST http://localhost:3000/api/products
  @Post()
  public createProducts(@Body() body: CreateProductDTO): ProductType[] {
    const newProduct: ProductType = {
      id:
        this.products.length > 0
          ? Math.max(...this.products.map((p) => p.id)) + 1
          : 1,
      title: body.title,
      price: body.price,
    };

    this.products.push(newProduct);
    return this.products;
  }

  // GET http://localhost:3000/api/products
  @Get()
  public getAllProducts(): ProductType[] {
    return this.products;
  }

  // GET http://localhost:3000/api/products/:id
  @Get(':id')
  public getProductById(@Param('id') id: string): ProductType[] {
    const productId = parseInt(id);
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      return [product];
    }
    return [];
  }

  // DELETE http://localhost:3000/api/products/:id
  @Delete(':id')
  public deleteProduct(@Param('id') id: string): ProductType[] {
    const productId = parseInt(id);
    const productIndex = this.products.findIndex((p) => p.id === productId);
    if (productIndex !== -1) {
      this.products.splice(productIndex, 1);
    }
    return this.products;
  }
}
