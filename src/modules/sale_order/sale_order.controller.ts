import { Body, Controller, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { SaleOrderService } from './sale_order.service';
import { DeliveryConfirmationReqDto, DueUpdateReqDto, QueryReqEntitiesDto, SaleOrderApiResponse, SaleOrderCreateDto } from 'src/dto/sale_order.dto';
import { SaleOrderValidationService } from 'src/custom-validation/sale_order.validation';

@Controller('sale-order')
export class SaleOrderController {
  constructor(private saleOrderService: SaleOrderService, private saleOrderValidationService: SaleOrderValidationService) {}

  @Post('/')
  async saleOrderHandle(@Query() query: QueryReqEntitiesDto, @Res() res: Response, @Body() reqBody?: SaleOrderCreateDto): Promise<void> {
    try {
      if(query && query.action === 'approve') {
        const validationResult = await this.saleOrderValidationService.SaleOrderGenerateValidation(reqBody, query.orderId);

        if(!validationResult.isValid) {
          const apiResponse: SaleOrderApiResponse = {
            message: `Validation error`,
            error: validationResult.error,
            statusCode: 400,
          }
          res.json(apiResponse);
        } else {
          const result = await this.saleOrderService.handleSaleOrder(query, reqBody);
          const apiResponse: SaleOrderApiResponse = {
            message: result.message,
            sale_order: result.statusCode === 200 && result.sale_order,
            statusCode: result.statusCode
          }
          res.json(apiResponse);
        }
      } else if(query && query.action === 'reject') {
        const result = await this.saleOrderService.handleSaleOrder(query);
        const apiResponse: SaleOrderApiResponse = {
          message: result.message,
          statusCode: result.statusCode
        }
        res.json(apiResponse);
      } else {
        const apiResponse: SaleOrderApiResponse = {
          message:  `Request denied`,
          statusCode: 403
        }
        res.json(apiResponse);
      }
    } catch (error) {
      console.log(error);
      const apiResponse: SaleOrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  };

  @Patch('/delivery/:saleOrderId')
  async orderDeliveryConfirmation (@Param() params: any, @Body() reqBody: DeliveryConfirmationReqDto, @Res() res: Response): Promise<void> {
    try {
      const validationResult = await this.saleOrderValidationService.deliveryConfirmationValidation(reqBody);

      if(!validationResult.isValid) {
        const apiResponse: SaleOrderApiResponse = {
          message: `Validation error`,
          error: validationResult.error,
          statusCode: 400,
        }
        res.json(apiResponse);
      } else {
        const result = await this.saleOrderService.handleOrderDelivery(reqBody, params.saleOrderId);
        const apiResponse: SaleOrderApiResponse = {
          message: result.message,
          statusCode: result.statusCode
        }
        res.json(apiResponse);
      }
    } catch (error) {
      console.log(error);
      const apiResponse: SaleOrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  };

  @Patch('/due/update/:saleOrderId')
  async dueUpdateHandler(@Param() params: any, @Body() reqBody: DueUpdateReqDto, @Res() res: Response): Promise<void> {
    try {
      const validationResult = await this.saleOrderValidationService.dueUpdateValidation(reqBody, params.saleOrderId);
      if(!validationResult.isValid) {
        const apiResponse: SaleOrderApiResponse = {
          message: `Validation error`,
          error: validationResult.error,
          statusCode: 400,
        }
        res.json(apiResponse);
      } else {
        const result = await this.saleOrderService.handleDueUpdate(reqBody, params.saleOrderId);
        const apiResponse: SaleOrderApiResponse = {
          message: result.message,
          sale_order: result.statusCode === 200 && result.sale_order,
          statusCode: result.statusCode
        }
        res.json(apiResponse);
      }
    } catch (error) {
      console.log(error);
      const apiResponse: SaleOrderApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  }
}
