import { Body, Controller, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateOrderDto, OrderApiResponse } from 'src/dto/order.dto';
import { OrderValidationService } from 'src/custom-validation/order.validation';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService, private orderValidation: OrderValidationService) {}

  @Post('/make/:cartId')
  @UseGuards(AuthGuard)
  async makeOrder(@Body() reqBody: CreateOrderDto, @Param() params: any, @Res() res: Response) {
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
  }
}
