import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { JwtAuthService } from 'src/jwt/jwt.service';
import { IsAdminMiddleware } from 'src/middlewares/isAdmin.middleware';

@Module({
  providers: [ProductService, JwtAuthService],
  controllers: [ProductController]
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
            .apply(IsAdminMiddleware)
            .forRoutes(
              { path: 'product/add', method: RequestMethod.POST }
            )
  }
}
