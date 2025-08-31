import { config } from 'dotenv';
import { Product } from 'src/products/product.entity';
import { Review } from 'src/reviewes/review.entity';
import { User } from 'src/users/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

config({ path: '.env' });

// comment
export const dataSourceOption: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DB_URL,
  entities: [User, Product, Review],
  migrations: ['dist/db/migrations/*.js'],
};

export const dataSource = new DataSource(dataSourceOption);
