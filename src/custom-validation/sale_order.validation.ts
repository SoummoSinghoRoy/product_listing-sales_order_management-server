import { Injectable } from '@nestjs/common';
import { SaleOrderCreateDto, DtoValidationResult } from 'src/dto/sale_order.dto';


@Injectable()
export class SaleOrderValidationService {

  async SaleOrderGenerateValidation(reqBody: SaleOrderCreateDto): Promise<DtoValidationResult> {
    let error: { [field: string]: string } = {};
    
    if(!reqBody.paid) {
      error.paid = `Paid amount is required`
    }

    // here need to validate paid amount cannot greater than total_amount

    if(reqBody.due !== 0 || reqBody.due > 0) {
      error.due = `Due amount is required`
    }

    // here need to validate due amount cannot greater than paid
  
    return {
      error,
      isValid: Object.keys(error).length === 0
    }
  }
}