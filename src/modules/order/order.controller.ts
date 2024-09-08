import { Body, Controller, Delete, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateOrderDto, OrderApiResponse } from 'src/dto/order.dto';
import { OrderValidationService } from 'src/custom-validation/order.validation';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService, private orderValidation: OrderValidationService) {}

  @Post('/make/:cartId')
  @UseGuards(AuthGuard)
  async makeOrder(@Param() params: any, @Body() reqBody: CreateOrderDto, @Res() res: Response) {
    try {
      const validationResult = this.orderValidation.productAddToCartValidation(reqBody);
      if(!validationResult.isValid) {
        const apiResponse: OrderApiResponse = {
          message: `Validation error`,
          error: validationResult.error,
          statusCode: 400,
        }
        res.json(apiResponse);
      } else {        
        const result = await this.orderService.acceptOrder(reqBody, params.cartId);
        const apiResponse: OrderApiResponse = {
          message: result.message,
          order_details: result.statusCode === 200 && result.order_details,
          statusCode: result.statusCode,
        }
        res.json(apiResponse);
      }
    } catch (error) {
      console.log(error);
      const apiResponse: OrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  };

  @Get('/all')
  async allOrdersListOfAllCustomers(@Query('pageNumber') pageNumber: string, @Res() res: Response): Promise<void> {
    try {
      const result = await this.orderService.allOrderOfAllCustomers(pageNumber);
      const apiResponse: OrderApiResponse = {
        message: result.message,
        order_details: result.statusCode === 200 && result.order_details,
        statusCode: result.statusCode,
      }
      res.json(apiResponse);
    } catch (error) {
      console.log(error);
      const apiResponse: OrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  };

  @Get('/search')
  async searchOrders(@Query('searchTerm') searchTerm: string, @Res() res: Response): Promise<void> {
    try {
      const result = await this.orderService.searchOrder(searchTerm);
      const apiResponse: OrderApiResponse = {
        message: result.message,
        order_details: result.statusCode === 200 && result.order_details,
        statusCode: result.statusCode,
      }
      res.json(apiResponse);
    } catch (error) {
      console.log(error);
      const apiResponse: OrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  }

  @Get('/single/:orderId')
  @UseGuards(AuthGuard)
  async retrieveSingleOrder(@Param() params: any, @Res() res: Response): Promise<void> {
    try {
      const result = await this.orderService.getSingleOrder(params.orderId);
      const apiResponse: OrderApiResponse = {
        message: result.message,
        order_details: result.statusCode === 200 && result.order_details,
        statusCode: result.statusCode
      }
      res.json(apiResponse);
    } catch (error) {
      console.log(error);
      const apiResponse: OrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  };

  @Get('/all-orders/:customerId')
  @UseGuards(AuthGuard)
  async retrieveAllOrderOfSingleCustomer(@Param() params: any, @Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const result = await this.orderService.allOrderOfSingleCustomer(params.customerId);
      const apiResponse: OrderApiResponse = {
        message: result.message,
        order_details: result.statusCode === 200 && result.order_details,
        statusCode: result.statusCode
      }
      res.json(apiResponse);
    } catch (error) {
      console.log(error);
      const apiResponse: OrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  }

  @Delete('/cancel/:orderId')
  @UseGuards(AuthGuard)
  async cancelOrder(@Param() params: any, @Res() res: Response): Promise<void> {
    try {
      const result = await this.orderService.cancelOrder(params.orderId);
      const apiResponse: OrderApiResponse = {
        message: result.message,
        statusCode: result.statusCode,
      }
      res.json(apiResponse);
    } catch (error) {
      console.log(error);
      const apiResponse: OrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  }
}
