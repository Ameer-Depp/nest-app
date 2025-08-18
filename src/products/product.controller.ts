import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateProductDTO } from './dtos/create-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { ProductService } from './product.service';

@Controller('api/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  public createProducts(@Body() body: CreateProductDTO) {
    return this.productService.createProducts(body);
  }

  @Get()
  public getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  public getOneProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getOneProductById(id);
  }

  @Put(':id')
  public updateProductById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDTO,
  ) {
    return this.productService.updateProductById(id, body);
  }

  @Delete(':id')
  public async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    await this.productService.deleteProduct(id);
    return { message: 'product deleted successfully' };
  }
}
