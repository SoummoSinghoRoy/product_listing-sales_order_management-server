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
  };

  async cancelOrder(orderId: string): Promise<OrderApiResponse> {
    try {
      const validOrder = await this.prismaDB.order.findUnique({
        where: {
          id: parseInt(orderId)
        },
        include: {
          cart: {
            include: {
              cart_items: true
            }
          }
        }
      });
      if(validOrder && validOrder.order_status === "accepted") {
        const deletedOrder = await this.prismaDB.order.delete({
          where: {
            id: validOrder.id
          },
          include: {
            cart: {
              include: {
                cart_items: true
              }
            }
          }
        });
                
        deletedOrder.cart.cart_items.forEach(async (item) => {
          const validProduct = await this.prismaDB.product.findUnique({
            where: {
              id: item.productId
            }
          });
          if(validProduct) {
            await this.prismaDB.product.update({
              where: {
                id: validProduct.id
              },
              data: {
                quantity: validProduct.quantity + item.quantity
              }
            })
          }
        });
        if(deletedOrder) {
          const deletedcart = await this.prismaDB.cart.delete({
            where: {
              id: deletedOrder.cartId
            }
          });
          if(deletedcart) {
            const result: OrderApiResponse = {
              message: `Accepted order cancelation request`,
              statusCode: 200
            }
            return result;
          }
        }
      } else if(validOrder && validOrder.order_status === "processing") {
        const result: OrderApiResponse = {
          message: `No longer accepted cancel request`,
          statusCode: 405
        }
        return result;
      } else {
        const result: OrderApiResponse = {
          message: `Invalid order`,
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
  };

  async allOrderOfSingleCustomer(customerId: string): Promise<OrderApiResponse> {
    try {
      const validCustomer = await this.prismaDB.customer.findUnique({
        where: {
          id: parseInt(customerId)
        }
      });
      if(validCustomer) {
        const orders = await this.prismaDB.order.findMany({
          where: {
            customerId: validCustomer.id
          },
          include: {
            customer: true,
            cart: {
              include: {
                cart_items: {
                  include: {
                    product: true
                  }
                }
              }
            }
          }
        }); 
        if(orders.length !== 0) {
          const result: OrderApiResponse = {
            message: `Order retrieve successfully`,
            order_details: orders,
            statusCode: 200
          }
          return result;
        } else {
          const result: OrderApiResponse = {
            message: `Order is empty`,
            statusCode: 404
          }
          return result;
        }
      } else {
        const result: OrderApiResponse = {
          message: `Customer not valid`,
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
  };
  
  async allOrderOfAllCustomers(): Promise<OrderApiResponse> {
    try {
      const allCustomersOrders = await this.prismaDB.order.findMany({
        include: {
          customer: true,
          cart: {
            include: {
              cart_items: {
                include: {
                  product: true
                }
              }
            }
          }
        }
      });

      if(allCustomersOrders.length !== 0) {
        const result: OrderApiResponse = {
          message: `All orders retrieve successfully`,
          order_details: allCustomersOrders,
          statusCode: 200
        }
        return result;
      } else {
        const result: OrderApiResponse = {
          message: `Orders empty`,
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

// sale-order, order accept houyar por eta only admin korbe. order accepted hobe tarpor admin order details dekhbe. sekhan theke order confirm korle sale order karjokor hobe. ejonyo request theke reject othoba confirm message nibo. reject message hole order model er order status reject hobe ebong sale order record thakbe na. confirm message hole order status ongoing dekhabe. pashapashi cart er order_status processing hobe. order delivery kore felle sale order status update kore delivered dekhabe, ebong cart er order status delivered dekhabo. 
