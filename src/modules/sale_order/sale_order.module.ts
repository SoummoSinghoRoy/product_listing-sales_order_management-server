import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { SaleOrderService } from './sale_order.service';
import { SaleOrderController } from './sale_order.controller';
import { JwtAuthService } from 'src/jwt/jwt.service';
import { IsAdminMiddleware } from 'src/middlewares/isAdmin.middleware';
import { SaleOrderValidationService } from 'src/custom-validation/sale_order.validation';

@Module({
  providers: [SaleOrderService, JwtAuthService, SaleOrderValidationService],
  controllers: [SaleOrderController]
})
export class SaleOrderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
            .apply(IsAdminMiddleware)
            .forRoutes(
              { path: 'sale-order/', method: RequestMethod.POST },
              { path: 'sale-order/delivery/:saleOrderId', method: RequestMethod.PATCH },
              { path: 'sale-order/due/update/:saleOrderId', method: RequestMethod.PATCH }
            )
  }
}
