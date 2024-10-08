import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { SaleOrderService } from './sale_order.service';
import { SaleOrderController } from './sale_order.controller';
import { JwtAuthService } from 'src/jwt/jwt.service';
import { IsAdminMiddleware } from 'src/middlewares/isAdmin.middleware';
import { SaleOrderValidationService } from 'src/custom-validation/sale_order.validation';
import { WinstonLogger } from 'src/logger/winston-logger.service';

@Module({
  providers: [SaleOrderService, JwtAuthService, WinstonLogger, SaleOrderValidationService],
  controllers: [SaleOrderController]
})
export class SaleOrderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
            .apply(IsAdminMiddleware)
            .forRoutes(
              { path: 'sale-order/', method: RequestMethod.POST },
              { path: 'sale-order/all', method: RequestMethod.GET },
              { path: 'sale-order/single/:saleOrderId', method: RequestMethod.GET },
              { path: 'sale-order/queries', method: RequestMethod.GET },
              { path: 'sale-order/delivery/:saleOrderId', method: RequestMethod.PATCH },
              { path: 'sale-order/due/update/:saleOrderId', method: RequestMethod.PATCH }
            )
  }
}
