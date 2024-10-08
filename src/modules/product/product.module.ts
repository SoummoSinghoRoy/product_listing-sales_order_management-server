import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { JwtAuthService } from 'src/jwt/jwt.service';
import { IsAdminMiddleware } from 'src/middlewares/isAdmin.middleware';
import { WinstonLogger } from 'src/logger/winston-logger.service';

@Module({
  providers: [ProductService, JwtAuthService, WinstonLogger],
  controllers: [ProductController]
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
            .apply(IsAdminMiddleware)
            .forRoutes(
              { path: 'product/add', method: RequestMethod.POST },
              { path: 'product/edit/:id', method: RequestMethod.PUT },
              { path: 'product/edit/stock/:id', method: RequestMethod.PATCH },
              { path: 'product/delete/:id', method: RequestMethod.DELETE }
            )
  }
}
