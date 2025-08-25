import { ClassSerializerInterceptor, Module } from '@nestjs/common';

// the modules of the project
import { ProductModule } from './products/product.module';
import { UserModule } from './users/user.module';
import { ReviewModule } from './reviewes/review.module';

// the database ORM used in this project
import { TypeOrmModule } from '@nestjs/typeorm';

// the database entity (schemas) for each module
import { Product } from './products/product.entity';
import { Review } from './reviewes/review.entity';
import { User } from './users/user.entity';

// the ConfigModule is used to pair the project with the .env file, ConfigService used to create the database configurations
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UploadModule } from './uploads/upload.module';

@Module({
  imports: [
    //static code (reuseable 3 lines below)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    ProductModule,
    UserModule,
    ReviewModule,
    UploadModule,
    //static code (reuseable 11 lines below)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        synchronize: process.env.NODE_ENV !== 'production', // turn off in production!
        entities: [Product, Review, User],
      }),
    }),
    //static code (reuseable 3 lines below)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
  ],
  //static code (reuseable 2 lines below)
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}
