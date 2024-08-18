import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { IsEmailExistConstraint } from 'src/custom-validation/IsEmailExist';
import ProductValidationService from 'src/custom-validation/product.validation';

@Global()
@Module({
  providers: [DatabaseService, IsEmailExistConstraint, ProductValidationService],
  exports: [DatabaseService, ProductValidationService]
})
export class DatabaseModule {}
