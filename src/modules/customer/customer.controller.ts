import { Body, Controller, Patch, Post, Req, Res, UsePipes } from '@nestjs/common';
import { Response, Request } from 'express';
import { CustomerService } from './customer.service';
import { CreateCustomerDto, CustomerApiResponse, UpdateCustomerDto } from 'src/dto/customer.dto';
import { CustomValidationPipe } from 'src/pipes/validation.pipes';

@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post('/add')
  @UsePipes(CustomValidationPipe)
  async addCustomer(@Body() reqBody: CreateCustomerDto, @Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      if(reqBody.password === reqBody.confirmPassword) {
        if(req.path === '/api/customer/add') {
          const customerReqBody = { ...reqBody, role: 'customer' };
          const result = await this.customerService.createCustomer(customerReqBody);
          const apiResponse: CustomerApiResponse = {
            message: result.message,
            customer: result.statusCode === 200 && result.customer,
            statusCode: result.statusCode,
          }
          res.json(apiResponse);
        }
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
  @Patch('/edit/:id')
  @UsePipes(CustomValidationPipe)
  async updateCustomer(@Body() reqbody: UpdateCustomerDto, @Req() req: Request, @Res() res: Response): Promise<void> {
    let { id } = req.params;
    const user = req['user'];
    try {
      if(user.customerId === parseInt(id)) {
        const result = await this.customerService.editCustomer(reqbody, id, user.id);
        const apiResponse: CustomerApiResponse = {
          message: result.message,
          customer: result.statusCode === 200 && result.customer,
          statusCode: result.statusCode,
        }
        res.json(apiResponse);
      } else {
        const apiResponse: CustomerApiResponse = {
          message: `Request forbidden`,
          statusCode: 403
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
