import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { JwtAuthService } from './jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { CustomerModule } from './modules/customer/customer.module';
import { ProductModule } from './modules/product/product.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { SaleOrderModule } from './modules/sale_order/sale_order.module';

@Module({
  imports: [DatabaseModule, UserModule, CustomerModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET
    }),
    ProductModule,
    CartModule,
    OrderModule,
    SaleOrderModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtAuthService],
})
export class AppModule {}
