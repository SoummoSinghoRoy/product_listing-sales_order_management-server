import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateCartDto, DtoValidationResult } from 'src/dto/cart.dto';


@Injectable()
export class CartValidationService {
  constructor(private readonly prismaDB: DatabaseService) {}

  async productAddToCartValidation(reqBody: CreateCartDto): Promise<DtoValidationResult> {
    let error: { [field: string]: string } = {};
    
    if(!reqBody.productId) {
      error.product = `Product is required`
    } else {
      const product = await this.prismaDB.product.findUnique({
        where: {
          id: parseInt(reqBody.productId)
        }
      });

      if(!product) {
        error.product = `Product not valid`
      } else {
        if(!reqBody.quantity) {
          error.quantity = `Quantity is required`
        } else if(reqBody.quantity === '0') {
          error.quantity = `Min quantity should be 1`
        } else if(product.quantity < parseInt(reqBody.quantity)) {
          error.quantity = `Requested quantity is not available`
        }
      }
    }
  
    return {
      error,
      isValid: Object.keys(error).length === 0
    }
  }
}