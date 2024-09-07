import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { DatabaseService } from 'src/database/database.service';
import { DeliveryConfirmationReqDto, SaleOrderCheckReqBody, DueUpdateReqDto, QueryReqEntitiesDto, SaleOrderApiResponse, SaleOrderCreateDto } from 'src/dto/sale_order.dto';

@Injectable()
export class SaleOrderService {
  constructor(private prismaDB: DatabaseService) {}

  async handleSaleOrder(reqQuery: QueryReqEntitiesDto, reqBody?: SaleOrderCreateDto): Promise<SaleOrderApiResponse> {
    try {
      const validOrder = await this.prismaDB.order.findUnique({
        where: {
          id: parseInt(reqQuery.orderId)
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

      if (validOrder && validOrder.order_status === "accepted") {
        if (reqQuery.action === 'approve') {
          const date = moment().tz('Asia/Dhaka').format('YYYY-MM-DD');
          const sale_order = await this.prismaDB.saleOrder.create({
            data: {
              orderId: validOrder.id,
              total_amount: validOrder.order_amount,
              paid: reqBody.paid,
              due: reqBody.due,
              payment_status: validOrder.order_amount === reqBody.paid ? "paid" : "due",
              last_payment_date: reqBody.payment_date,
              sale_date: date
            }
          });
          await this.prismaDB.order.update({
            where: {
              id: validOrder.id
            },
            data: {
              order_status: sale_order.order_status
            }
          });

          const result: SaleOrderApiResponse = {
            message: `Order is approved`,
            sale_order: sale_order,
            statusCode: 200
          }
          return result;
        } else if (reqQuery.action === 'reject') {
          await this.prismaDB.order.update({
            where: {
              id: validOrder.id
            },
            data: {
              order_status: 'rejected'
            }
          });
          const result: SaleOrderApiResponse = {
            message: `Order is rejected`,
            statusCode: 200
          }
          return result;
        } else {
          const result: SaleOrderApiResponse = {
            message: `Request denied`,
            statusCode: 403
          }
          return result;
        }
      } else {
        const result: SaleOrderApiResponse = {
          message: `Order not valid`,
          statusCode: 404
        }
        return result;
      }
    } catch (error) {
      console.log(error);
      const result: SaleOrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  };

  async findAllSaleOrders(pageNumber: string): Promise<SaleOrderApiResponse> {
    try {
      const salesOrderPerPage = 30;
      const page = parseInt(pageNumber) || 1;
      const salesOrders = await this.prismaDB.saleOrder.findMany({
        skip: (page - 1) * salesOrderPerPage,
        take: salesOrderPerPage
      });
      const totalSalesOrder = await this.prismaDB.saleOrder.count();
      if(salesOrders.length !== 0) {
        const result: SaleOrderApiResponse = {
          message: `Sale orders found`,
          sale_order: {
            allSalesOrder: salesOrders,
            totalSalesOrder,
            totalPages: Math.ceil(totalSalesOrder / salesOrderPerPage)
          },
          statusCode: 200
        }
        return result;
      } else {
        const result: SaleOrderApiResponse = {
          message: `Sale orders is empty`,
          statusCode: 404
        }
        return result;
      }
    } catch (error) {
      console.log(error);
      const result: SaleOrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  };

  async getSingleSaleOrder(saleOrderId: string): Promise<SaleOrderApiResponse> {
    try {
      const validSaleOrder = await this.prismaDB.saleOrder.findUnique({
        where: {
          id: parseInt(saleOrderId)
        },
        include: {
          order: {
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
          }
        }
      });
      if(validSaleOrder) {
        const result: SaleOrderApiResponse = {
          message: `Sale order found`,
          sale_order: validSaleOrder,
          statusCode: 200
        }
        return result;
      } else {
        const result: SaleOrderApiResponse = {
          message: `Sale order not valid`,
          statusCode: 404
        }
        return result;
      }
    } catch (error) {
      console.log(error);
      const result: SaleOrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  };

  async findSaleOrderByPaymentStatusOrOrderId(searchReqbody: SaleOrderCheckReqBody): Promise<SaleOrderApiResponse> {
    try {
      if(searchReqbody.payment_status && searchReqbody.orderId) {
        const validSaleOrder = await this.prismaDB.saleOrder.findUnique({
          where: {
            orderId: parseInt(searchReqbody.orderId),
            payment_status: searchReqbody.payment_status
          }
        });
        if(validSaleOrder) {
          const result: SaleOrderApiResponse = {
            message: `Sale order found`,
            sale_order: validSaleOrder,
            statusCode: 200
          }
          return result;
        } else {
          const result: SaleOrderApiResponse = {
            message: `Sale order not found`,
            statusCode: 404
          }
          return result;
        }
      } else if(searchReqbody.payment_status) {
        const validSaleOrder = await this.prismaDB.saleOrder.findMany({
          where: {
            payment_status: searchReqbody.payment_status
          }
        });

        if(validSaleOrder.length !== 0) {
          const result: SaleOrderApiResponse = {
            message: `Sale orders found`,
            sale_order: validSaleOrder,
            statusCode: 200
          }
          return result;
        } else {
          const result: SaleOrderApiResponse = {
            message: `Sale orders not found`,
            statusCode: 404
          }
          return result;
        }
      } else if(searchReqbody.orderId) {
        const validSaleOrder = await this.prismaDB.saleOrder.findUnique({
          where: {
            orderId: parseInt(searchReqbody.orderId)
          }
        });
        if(validSaleOrder) {
          const result: SaleOrderApiResponse = {
            message: `Sale order found`,
            sale_order: validSaleOrder,
            statusCode: 200
          }
          return result;
        } else {
          const result: SaleOrderApiResponse = {
            message: `Sale order not found`,
            statusCode: 404
          }
          return result;
        }
      }
    } catch (error) {
      console.log(error);
      const result: SaleOrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  };

  async handleOrderDelivery(confirmationReqBody: DeliveryConfirmationReqDto, saleOrderId: string): Promise<SaleOrderApiResponse> {
    try {
      const validSaleOrder = await this.prismaDB.saleOrder.findUnique({
        where: {
          id: parseInt(saleOrderId)
        }
      });
      if (validSaleOrder) {
        if (confirmationReqBody.action === 'yes') {
          const updatedSaleOrder = await this.prismaDB.saleOrder.update({
            where: {
              id: validSaleOrder.id
            },
            data: {
              order_status: 'delivered'
            }
          });
          await this.prismaDB.order.update({
            where: {
              id: validSaleOrder.orderId
            },
            data: {
              order_status: updatedSaleOrder.order_status
            }
          });
          const result: SaleOrderApiResponse = {
            message: `Order successfully delivered`,
            statusCode: 200
          }
          return result;
        } else {
          const result: SaleOrderApiResponse = {
            message: `Request denied`,
            statusCode: 403
          }
          return result;
        }
      } else {
        const result: SaleOrderApiResponse = {
          message: `Sale order not valid`,
          statusCode: 404
        }
        return result;
      }
    } catch (error) {
      console.log(error);
      const result: SaleOrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  };

  async handleDueUpdate(dueUpdateReqBody: DueUpdateReqDto, saleOrderId: string): Promise<SaleOrderApiResponse> {
    try {
      const validSaleOrder = await this.prismaDB.saleOrder.findUnique({
        where: {
          id: parseInt(saleOrderId)
        }
      });
      if (validSaleOrder) {
        const updatedPaid = validSaleOrder.paid + dueUpdateReqBody.newPaidAmount;
        const updatedSaleOrder = await this.prismaDB.saleOrder.update({
          where: {
            id: validSaleOrder.id
          },
          data: {
            paid: updatedPaid,
            due: dueUpdateReqBody.newDueAmount,
            last_payment_date: dueUpdateReqBody.payment_date,
            payment_status: validSaleOrder.total_amount === updatedPaid ? "paid" : "due"
          }
        });
        const result: SaleOrderApiResponse = {
          message: `Due successfully updated`,
          sale_order: updatedSaleOrder,
          statusCode: 200
        }
        return result;
      } else {
        const result: SaleOrderApiResponse = {
          message: `Sale order not valid`,
          statusCode: 404
        }
        return result;
      }
    } catch (error) {
      console.log(error);
      const result: SaleOrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  };
}

