import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { IsEmailExistConstraint } from 'src/custom-validation/IsEmailExist';
import ProductValidationService from 'src/custom-validation/product.validation';
import { CartValidationService } from 'src/custom-validation/cart.validation';

@Global()
@Module({
  providers: [DatabaseService, IsEmailExistConstraint, ProductValidationService, CartValidationService],
  exports: [DatabaseService, ProductValidationService, CartValidationService]
})
export class DatabaseModule {}
