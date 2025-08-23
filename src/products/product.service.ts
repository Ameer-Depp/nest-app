/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDTO } from './dtos/create-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';
import {
  Between,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/users/user.service';

// Injectable means you can dependency inject an object from this class into the contractor of another class to use it's full functionality
@Injectable()
export class ProductService {
  constructor(
    // better than create an object for each function, use DE that call the product's entity fields
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly userService: UserService,
  ) {}

  /**
   * CREATE NEW PRODUCT
   * @param CreateProductDTO
   * @param userId - ID of the user creating the product
   * @returns Created product with user relation
   */
  public async createProducts(dto: CreateProductDTO, userId: number) {
    const user = await this.userService.getUserProfile(userId);
    const newProduct = this.productRepository.create(dto);
    newProduct.user = user;
    return this.productRepository.save(newProduct);
  }

  /**
   * GET ALL PRODUCTS
   * @returns List of all products with user and reviews relations
   */
  public async getAllProducts(
    title?: string,
    minPrice?: string,
    maxPrice?: string,
  ) {
    // Build the where clause dynamically
    const where: any = {};

    if (title) {
      where.title = Like(`%${title.toLowerCase()}%`);
    }

    if (minPrice && maxPrice) {
      where.price = Between(parseInt(minPrice), parseInt(maxPrice));
    } else if (minPrice) {
      where.price = MoreThanOrEqual(parseInt(minPrice));
    } else if (maxPrice) {
      where.price = LessThanOrEqual(parseInt(maxPrice));
    }

    return this.productRepository.find({
      where,
      relations: { user: true, reviews: true },
    });
  }

  /**
   * GET PRODUCT BY ID
   * @param id - Product ID
   * @returns Product data with user and reviews relations
   */
  public async getOneProductById(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { user: true, reviews: true },
    });
    if (!product) {
      throw new NotFoundException('product not found');
    }
    return product;
  }

  /**
   * UPDATE PRODUCT BY ID
   * @param id - Product ID
   * @param UpdateProductDTO
   * @returns Updated product data
   */
  public async updateProductById(id: number, dto: UpdateProductDTO) {
    const product = await this.getOneProductById(id);

    product.title = dto.title ?? product.title;
    product.price = dto.price ?? product.price;
    product.description = dto.description ?? product.description;

    return this.productRepository.save(product);
  }

  /**
   * DELETE PRODUCT
   * @param id - Product ID to delete
   */
  public async deleteProduct(id: number) {
    const product = await this.getOneProductById(id);
    await this.productRepository.remove(product);
  }
}
