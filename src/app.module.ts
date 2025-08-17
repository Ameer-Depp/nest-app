import { Module } from '@nestjs/common';
import { ProductModule } from './products/product.module';
import { UserModule } from './users/user.module';
import { ReviewModule } from './reviewes/review.module';

@Module({
  imports: [ProductModule, UserModule, ReviewModule],
  exports: [],
  providers: [],
  controllers: [],
})
export class AppModule {}
