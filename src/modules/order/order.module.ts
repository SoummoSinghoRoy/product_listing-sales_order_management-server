import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { JwtAuthService } from 'src/jwt/jwt.service';
import { OrderValidationService } from 'src/custom-validation/order.validation';

@Module({
  providers: [OrderService, JwtAuthService, OrderValidationService],
  controllers: [OrderController]
})
export class OrderModule {}
