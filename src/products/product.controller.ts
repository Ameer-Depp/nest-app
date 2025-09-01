/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Put,
  ParseIntPipe,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiSecurity } from '@nestjs/swagger';

import { CreateProductDTO } from './dtos/create-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { Roles } from 'src/users/decorators/roles.decorator';
import { UserType } from 'src/users/user.entity';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { ProductFiltersDTO } from './dtos/product-filter.dto';

@Controller('api/products')
export class ProductController {
  // here we use the DE from the product.service file
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard) // <-- 1. First, authenticate (sets req.user)
  @Roles(UserType.Admin) // <-- 2. Then, authorize (checks req.user.userType)
  @ApiSecurity('bearer')
  createProducts(@Body() body: CreateProductDTO, @Request() req: any) {
    // Now req.user should be defined
    return this.productService.createProducts(body, req.user.id);
  }

  @Get()
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  public getAllProducts(@Query() filters: ProductFiltersDTO) {
    return this.productService.getAllProducts(
      filters.title,
      filters.minPrice,
      filters.maxPrice,
    );
  }

  @Get(':id')
  public getOneProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getOneProductById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserType.Admin)
  @ApiSecurity('bearer')
  public updateProductById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDTO,
  ) {
    return this.productService.updateProductById(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserType.Admin)
  @ApiSecurity('bearer')
  public async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    await this.productService.deleteProduct(id);
    return { message: 'product deleted successfully' };
  }
}
