import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { DatabaseService } from 'src/database/database.service';
import { DeliveryConfirmationReqDto, DueUpdateReqDto, QueryReqEntitiesDto, SaleOrderApiResponse, SaleOrderCreateDto } from 'src/dto/sale_order.dto';

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

      if(validOrder && validOrder.order_status === "accepted") {
        if(reqQuery.action === 'approve') {
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
        } else if(reqQuery.action === 'reject') {
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

  async handleOrderDelivery(confirmationReqBody: DeliveryConfirmationReqDto, saleOrderId: string): Promise<SaleOrderApiResponse> {
    try {
      const validSaleOrder = await this.prismaDB.saleOrder.findUnique({
        where: {
          id: parseInt(saleOrderId)
        }
      });
      if(validSaleOrder) {
        if(confirmationReqBody.action === 'yes') {
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
      if(validSaleOrder) {
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

// all customers & orders a pagination rakhte hobe.
