import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

// the modules of the project
import { ProductModule } from './products/product.module';
import { UserModule } from './users/user.module';
import { ReviewModule } from './reviewes/review.module';

// the database ORM used in this project
import { TypeOrmModule } from '@nestjs/typeorm';

// the database entity (schemas) for each module
// import { Product } from './products/product.entity';
// import { Review } from './reviewes/review.entity';
// import { User } from './users/user.entity';

// the ConfigModule is used to pair the project with the .env file, ConfigService used to create the database configurations
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UploadModule } from './uploads/upload.module';
import { LoggerMiddleware } from './middlewares/loggerMiddleware';
import { dataSourceOption } from 'db/data-source';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    //static code (reuseable 3 lines below)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}`
        : '.env',
    }),
    ProductModule,
    UserModule,
    ReviewModule,
    UploadModule,
    //static code (reuseable 11 lines below)
    TypeOrmModule.forRoot(dataSourceOption),
    //static code (reuseable 3 lines below)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV !== 'production'
          ? `.env.${process.env.NODE_ENV}`
          : '.env',
    }),
  ],
  //static code (reuseable 2 lines below)
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}

// local host database

// {
//       inject: [ConfigService],
//       useFactory: (config: ConfigService) => ({
//         type: 'postgres',
//         host: config.get<string>('DB_HOST', 'localhost'),
//         port: config.get<number>('DB_PORT', 5432),
//         username: config.get<string>('DB_USERNAME'),
//         password: config.get<string>('DB_PASSWORD'),
//         database: config.get<string>('DB_DATABASE'),
//         synchronize: process.env.NODE_ENV !== 'production', // turn off in production!
//         entities: [Product, Review, User],
//       }),
//     }
