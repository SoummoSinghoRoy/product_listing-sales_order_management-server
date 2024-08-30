import { Injectable } from '@nestjs/common';
import { CreateOrderDto, DtoValidationResult } from 'src/dto/order.dto';


@Injectable()
export class OrderValidationService {

  productAddToCartValidation(reqBody: CreateOrderDto): DtoValidationResult {
    let error: { [field: string]: string } = {};
    
    if(!reqBody.shipping_address) {
      error.shipping_address = `Shipping address is required`
    }
  
    return {
      error,
      isValid: Object.keys(error).length === 0
    }
  }
}

