import { Module } from '@nestjs/common';
import { ProductModule } from './products/product.module';
import { UserModule } from './users/user.module';
import { ReviewModule } from './reviewes/review.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';

@Module({
  imports: [
    ProductModule,
    UserModule,
    ReviewModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'nestJS-app-db',
      username: 'postgres',
      password: 'password',
      port: 5432,
      host: 'localhost',
      synchronize: true,
      entities: [Product],
    }),
  ],
  exports: [],
  providers: [],
  controllers: [],
})
export class AppModule {}
