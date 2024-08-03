import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { CustomerService } from './customer.service';
import { CreateCustomerDto, CustomerApiResponse } from 'src/dto/customer.dto';
import { CustomValidationPipe } from 'src/pipes/validation-exception.pipes';

@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post('/add')
  @UsePipes(CustomValidationPipe)
  async addCustomer(@Body() reqBody: CreateCustomerDto, @Res() res: Response) {
    try {
      if(reqBody.password === reqBody.confirmPassword) {
        const result = await this.customerService.createCustomer(reqBody);
        const apiResponse: CustomerApiResponse = {
          message: result.message,
          customer: result.statusCode === 200 && result.customer,
          statusCode: result.statusCode,
        }
        res.json(apiResponse);
      } else {
        const apiResponse: CustomerApiResponse = {
          message: `Confirm password doesn't match with password`,
          statusCode: 400
        }
        res.json(apiResponse);
      }
    } catch (error) {
      console.log(error);
      const apiResponse: CustomerApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  }
}
