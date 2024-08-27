import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { OrderApiResponse } from 'src/dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private prismaDB: DatabaseService) {}

  async acceptOrder(): Promise<OrderApiResponse> {
    try {
      // need cartId,
    } catch (error) {
      console.log(error);
      const result: OrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  }
}

// sale-order order accept houyar por eta only admin korbe. order accepted hobe tarpor admin order details dekhbe. sekhan theke order confirm korle sale order karjokor hobe. ejonyo request theke reject othoba confirm message nibo. reject message hole saleorder model er order status reject hobe. confirm message hole order status ongoing dekhabe. pashapashi cart er order_status processing hobe. order delivery kore felle sale order status update kore delivered dekhabe, ebong cart er order status delivered dekhabo. 
