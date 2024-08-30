import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { DatabaseService } from 'src/database/database.service';
import { CreateOrderDto, OrderApiResponse } from 'src/dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private prismaDB: DatabaseService) {}

  async acceptOrder(orderCreateReqBody: CreateOrderDto, cartId: string): Promise<OrderApiResponse> {
    try {
      const cart = await this.prismaDB.cart.findUnique({
        where: {
          id: parseInt(cartId)
        },
        include: {
          customer: true,
          cart_items: {
            include: {
              product: true
            }
          }
        }
      });

      if(cart) {
        const date = moment().tz('Asia/Dhaka').format('YYYY-MM-DD');

        let totalAmount: number = 0; 
        cart.cart_items.forEach((item) => {
          totalAmount += item.amount 
        });

        const order = await this.prismaDB.order.create({
          data: {
            customerId: cart.customerId,
            cartId: cart.id,
            order_amount: totalAmount,
            order_date: date,
            order_status: "accepted",
            shipping_address: orderCreateReqBody.shipping_address 
          }
        });
        const result: OrderApiResponse = {
          message: `Order placed successfully`,
          order_details: {
            id: order.id,
            customerId: order.customerId,
            cartId: order.cartId,
            order_amount: order.order_amount,
            order_date: order.order_date,
            order_status: order.order_status, 
            shipping_address: order.shipping_address,
            payment_method: order.payment_method
          },
          statusCode: 200
        }
        return result;
      } else {
        const result: OrderApiResponse = {
          message: `Cart is invalid`,
          statusCode: 404
        }
        return result;
      }
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

// sale-order, order accept houyar por eta only admin korbe. order accepted hobe tarpor admin order details dekhbe. sekhan theke order confirm korle sale order karjokor hobe. ejonyo request theke reject othoba confirm message nibo. reject message hole saleorder model er order status reject hobe. confirm message hole order status ongoing dekhabe. pashapashi cart er order_status processing hobe. order delivery kore felle sale order status update kore delivered dekhabe, ebong cart er order status delivered dekhabo. 
