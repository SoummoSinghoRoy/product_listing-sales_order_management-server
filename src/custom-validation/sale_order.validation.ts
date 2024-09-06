import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { SaleOrderCreateDto, DtoValidationResult, DueUpdateReqDto, DeliveryConfirmationReqDto } from 'src/dto/sale_order.dto';


@Injectable()
export class SaleOrderValidationService {
  constructor(private prismDB: DatabaseService) {}

  async SaleOrderGenerateValidation(reqBody: SaleOrderCreateDto, orderId: string): Promise<DtoValidationResult> {
    let error: { [field: string]: string } = {};
    
    const order = await this.prismDB.order.findUnique({
      where: {
        id: parseInt(orderId)
      }
    });

    if(!reqBody.paid) {
      error.paid = `Paid amount is required`
    }

    if(order) {
      if(reqBody.paid && order.order_amount < reqBody.paid) {
        error.paid = `Paid amount isn't valid`
      }
    } else {
      error.paid = `Error occurred`
    }

    if(!reqBody.payment_date) {
      error.payment_date = `Date is required`
    }
  
    return {
      error,
      isValid: Object.keys(error).length === 0
    }
  };

  async deliveryConfirmationValidation(reqBody: DeliveryConfirmationReqDto): Promise<DtoValidationResult> {
    let error: { [field: string]: string } = {};

    if(!reqBody.action) {
      error.action = `Delivery confirmation action is required`
    }

    return {
      error,
      isValid: Object.keys(error).length === 0
    }
  };

  async dueUpdateValidation(reqBody: DueUpdateReqDto, saleOrderId: string): Promise<DtoValidationResult> {
    let error: { [field: string]: string } = {};

    const saleOrder = await this.prismDB.saleOrder.findUnique({
      where: {
        id: parseInt(saleOrderId)
      }
    });

    if(!reqBody.newPaidAmount){
      error.paid = `Paid amount is required`
    }else if(saleOrder.total_amount < reqBody.newPaidAmount) {
      error.paid = `Paid amount isn't valid`
    }

    if(!reqBody.payment_date) {
      error.payment_date = `Date is required`
    }

    return {
      error,
      isValid: Object.keys(error).length === 0
    }
  }
}