import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { DatabaseService } from 'src/database/database.service';
import { CreateOrderDto, OrderApiResponse } from 'src/dto/order.dto';
import { WinstonLogger } from 'src/logger/winston-logger.service';

@Injectable()
export class OrderService {
  constructor(private prismaDB: DatabaseService, private logger: WinstonLogger) {}

  async acceptOrder(orderCreateReqBody: CreateOrderDto, cartId: string): Promise<OrderApiResponse> {
    try {
      const validCart = await this.prismaDB.cart.findUnique({
        where: {
          id: parseInt(cartId)
        },
        include: {
          customer: true,
          cart_items: {
            include: {
              product: true
            }
          },
          order: true
        }
      });

      if(validCart) {
        const date = moment().tz('Asia/Dhaka').format('YYYY-MM-DD');

        let totalAmount: number = 0; 
        validCart.cart_items.forEach((item) => {
          totalAmount += item.amount 
        });

        const order = await this.prismaDB.order.create({
          data: {
            customerId: validCart.customerId,
            cartId: validCart.id,
            order_amount: totalAmount,
            order_date: date,
            order_status: "accepted",
            shipping_address: orderCreateReqBody.shipping_address 
          }
        });
        await this.prismaDB.cart.update({
          where: {
            id: validCart.id
          },
          data: {
            cart_status: "done"
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
        this.logger.log(`Order placed successfully & update cart_status of cart`);
        return result;
      } else {
        const result: OrderApiResponse = {
          message: `Cart is invalid`,
          statusCode: 404
        }
        this.logger.log(`Invalid cart`);
        return result;
      }
    } catch (error) {
      console.log(error);
      const result: OrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      this.logger.error(error);
      return result;
    }
  };

  async allOrderOfAllCustomers(pageNumber: string): Promise<OrderApiResponse> {
    try {
      const ordersPerPage = 1;
      const page = parseInt(pageNumber) || 1;
      const allCustomersOrders = await this.prismaDB.order.findMany({
        skip: (page - 1) * ordersPerPage,
        take: ordersPerPage,
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

      const totalOrders = await this.prismaDB.order.count();
      if(allCustomersOrders.length !== 0) {
        const result: OrderApiResponse = {
          message: `All orders retrieve successfully`,
          order_details: {
            allOrders: allCustomersOrders,
            totalOrders,
            totalPages: Math.ceil(totalOrders / ordersPerPage)
          },
          statusCode: 200
        }
        this.logger.log(`Successfully retrieve orders with customers, cart & cart items details`);
        return result;
      } else {
        const result: OrderApiResponse = {
          message: `Orders empty`,
          statusCode: 404
        }
        this.logger.log(`Orders empty`);
        return result;
      }
    } catch (error) {
      console.log(error);
      const result: OrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      this.logger.error(error);
      return result;
    }
  };

  async getSingleOrder(orderId: string): Promise<OrderApiResponse> {
    try {
      const validOrder = await this.prismaDB.order.findUnique({
        where: {
          id: parseInt(orderId)
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
      if(validOrder) {
        const result: OrderApiResponse = {
          message: `Customer order found`,
          order_details: validOrder,
          statusCode: 200
        }
        this.logger.log(`Single order found`);
        return result;
      } else {
        const result: OrderApiResponse = {
          message: `Order not valid`,
          statusCode: 404
        }
        this.logger.log(`Invalid order`)
        return result;
      }
    } catch (error) {
      console.log(error);
      const result: OrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      this.logger.error(error);
      return result;
    }
  };

  async searchOrder(searchTerm: string): Promise<OrderApiResponse> {
    try {
      if(!searchTerm) {
        const result: OrderApiResponse = {
          message: `Use valid search term`,
          statusCode: 403
        }
        return result;
      }
      const orders = await this.prismaDB.order.findMany({
        where: {
          order_date: {
            contains: searchTerm
          }
        }
      });
      
      if(orders.length !== 0) {
        const result: OrderApiResponse = {
          message: `orders retrieved successfully`,
          order_details: orders,
          statusCode: 200
        }
        this.logger.log(`Orders retrive successfully by search keyword`);
        return result;
      } else {
        const result: OrderApiResponse = {
          message: `Order not found`,
          statusCode: 404
        }
        this.logger.log(`Orders not found by search keyword`);
        return result;
      }
    } catch (error) {
      console.log(error);
      const result: OrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      this.logger.error(error);
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
          this.logger.log(`Order found for this customer`);
          return result;
        } else {
          const result: OrderApiResponse = {
            message: `Order is empty`,
            statusCode: 404
          }
          this.logger.log(`Order not found for this customer`);
          return result;
        }
      } else {
        const result: OrderApiResponse = {
          message: `Customer not valid`,
          statusCode: 404
        }
        this.logger.log(`Trying to get order by invalid customer`);
        return result;
      }
    } catch (error) {
      console.log(error);
      const result: OrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      this.logger.error(error);
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
            this.logger.log(`Requesting to cancel order & accepted request`);
            return result;
          }
        }
      } else if(validOrder && validOrder.order_status === "processing") {
        const result: OrderApiResponse = {
          message: `No longer accepted cancel request`,
          statusCode: 405
        }
        this.logger.log(`Requesting to cancel order & not accepted request`);
        return result;
      } else {
        const result: OrderApiResponse = {
          message: `Invalid order`,
          statusCode: 404
        }
        this.logger.log(`Requested order not valid`);
        return result;
      }
    } catch (error) {
      console.log(error);
      const result: OrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      this.logger.error(error);
      return result;
    }
  };
}