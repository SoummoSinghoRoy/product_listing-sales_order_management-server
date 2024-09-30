import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { JwtAuthService } from 'src/jwt/jwt.service';
import { OrderValidationService } from 'src/custom-validation/order.validation';
import { IsAdminMiddleware } from 'src/middlewares/isAdmin.middleware';
import { WinstonLogger } from 'src/logger/winston-logger.service';

@Module({
  providers: [OrderService, JwtAuthService, WinstonLogger, OrderValidationService],
  controllers: [OrderController]
})
export class OrderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
            .apply(IsAdminMiddleware)
            .forRoutes(
              { path: 'order/all', method: RequestMethod.GET },
              { path: 'order/search', method: RequestMethod.GET }
            )
  }
}
