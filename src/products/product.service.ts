import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDTO } from './dtos/create-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async createProducts(dto: CreateProductDTO) {
    const newProduct = this.productRepository.create(dto);
    return this.productRepository.save(newProduct);
  }

  public async getAllProducts() {
    return this.productRepository.find();
  }

  public async getOneProductById(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('product not found');
    }
    return product;
  }

  public async updateProductById(id: number, dto: UpdateProductDTO) {
    const product = await this.getOneProductById(id);

    product.title = dto.title ?? product.title;
    product.price = dto.price ?? product.price;
    product.description = dto.description ?? product.description;

    return this.productRepository.save(product);
  }

  public async deleteProduct(id: number) {
    const product = await this.getOneProductById(id);
    await this.productRepository.remove(product);
  }
}
