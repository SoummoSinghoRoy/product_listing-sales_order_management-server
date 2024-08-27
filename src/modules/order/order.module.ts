import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { JwtAuthService } from 'src/jwt/jwt.service';

@Module({
  providers: [OrderService, JwtAuthService],
  controllers: [OrderController]
})
export class OrderModule {}
