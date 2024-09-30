import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { JwtAuthService } from 'src/jwt/jwt.service';
import { WinstonLogger } from 'src/logger/winston-logger.service';

@Module({
  providers: [CartService, JwtAuthService, WinstonLogger],
  controllers: [CartController]
})
export class CartModule {}
