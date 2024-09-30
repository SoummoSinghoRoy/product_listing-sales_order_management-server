import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { JwtAuthService } from 'src/jwt/jwt.service';
import { IsCustomerMiddleware } from 'src/middlewares/isCustomer.middleware';
import { IsAdminMiddleware } from 'src/middlewares/isAdmin.middleware';
import { WinstonLogger } from 'src/logger/winston-logger.service';

@Module({
  providers: [CustomerService, JwtAuthService, WinstonLogger],
  controllers: [CustomerController]
})
export class CustomerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
            .apply(IsCustomerMiddleware)
            .forRoutes(
              { path: 'customer/edit/:id', method: RequestMethod.PATCH },
            );
    consumer
            .apply(IsAdminMiddleware)
            .forRoutes(
              { path: 'customer/all', method: RequestMethod.GET } 
            );
  }
}
