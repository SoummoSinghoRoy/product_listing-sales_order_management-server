import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { IsEmailExistConstraint } from 'src/custom-validation/IsEmailExist';
import ProductValidationService from 'src/custom-validation/product.validation';
import { CartValidationService } from 'src/custom-validation/cart.validation';
import { SaleOrderValidationService } from 'src/custom-validation/sale_order.validation';

@Global()
@Module({
  providers: [DatabaseService, IsEmailExistConstraint, ProductValidationService, CartValidationService, SaleOrderValidationService],
  exports: [DatabaseService, ProductValidationService, CartValidationService, SaleOrderValidationService]
})
export class DatabaseModule {}
