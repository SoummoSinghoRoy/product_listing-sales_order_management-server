import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { JwtAuthService } from 'src/jwt/jwt.service';

@Module({
  providers: [CartService, JwtAuthService],
  controllers: [CartController]
})
export class CartModule {}
