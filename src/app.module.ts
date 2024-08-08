import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { JwtAuthService } from './jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [DatabaseModule, UserModule, CustomerModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET
    }),
    ProductModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtAuthService],
})
export class AppModule {}
