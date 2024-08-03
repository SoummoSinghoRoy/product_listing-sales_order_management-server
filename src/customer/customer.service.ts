import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';
import { CreateCustomerDto, CustomerApiResponse } from 'src/dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(private primsaDB: DatabaseService) {}

  async createCustomer(customerReqData: CreateCustomerDto) {
    try {
      const hashedPassword = await bcrypt.hash(customerReqData.password, 8);
      const customerAsUser = await this.primsaDB.customer.create({
        data: {
          contact_no: customerReqData.contact_no,
          address: customerReqData.address,
          user: {
            create: {
              name: customerReqData.name,
              email: customerReqData.email,
              password: hashedPassword,
            }
          }
        },
        include: {
          user: true
        }
      });
      const result: CustomerApiResponse = {
        message: `Account created successfully`,
        statusCode: 200,
        customer: {
          id: customerAsUser.id,
          name: customerAsUser.user.name,
          email: customerAsUser.user.email,
          contact_no: customerAsUser.contact_no,
        }
      }
      return result; 
    } catch (error) {
      console.log(error);
      const result: CustomerApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  }
}
