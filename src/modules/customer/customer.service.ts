import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';
import { CreateCustomerDto, CustomerApiResponse, UpdateCustomerDto } from 'src/dto/customer.dto';
import { WinstonLogger } from 'src/logger/winston-logger.service';

@Injectable()
export class CustomerService {
  constructor(private primsaDB: DatabaseService, private logger: WinstonLogger) {}

  async createCustomer(customerReqData: CreateCustomerDto): Promise<CustomerApiResponse> {
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
              role: customerReqData.role
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
          address: customerAsUser.address,
          role: customerAsUser.user.role
        }
      }
      this.logger.log(`Customer account created`);
      return result; 
    } catch (error) {
      console.log(error);
      const result: CustomerApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      this.logger.error(error);
      return result;
    }
  };

  async editCustomer(updateReqData: UpdateCustomerDto, customerId: string, userId: string): Promise<CustomerApiResponse> {
    try {
      const hashedPassword = await bcrypt.hash(updateReqData.password, 8);
      const updatedCustomerWithUser = await this.primsaDB.customer.update({
        where: {
          id: parseInt(customerId)
        },
        data: {
          contact_no: updateReqData.contact_no,
          address: updateReqData.address,
          user: {
            update: {
              where: {
                id: parseInt(userId)
              },
              data: {
                name: updateReqData.name,
                password: hashedPassword
              }
            }
          }
        },
        include: {
          user: true
        }
      });
      const result: CustomerApiResponse = {
        message: `Successfully updated`,
        statusCode: 200,
        customer: {
          id: updatedCustomerWithUser.id,
          name: updatedCustomerWithUser.user.name,
          contact_no: updatedCustomerWithUser.contact_no,
          address: updatedCustomerWithUser.address
        }
      }
      this.logger.log(`Customer account updated`);
      return result; 
    } catch (error) {
      console.log(error);
      const result: CustomerApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      this.logger.error(error);
      return result;
    }
  };

  async getAllCustomers(pageNumber: string): Promise<CustomerApiResponse> {
    try {
      const customersPerPage = 1;
      const page = parseInt(pageNumber) || 1;      
      const customers = await this.primsaDB.customer.findMany({
        skip: (page - 1) * customersPerPage,
        take: customersPerPage,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          order: true
        }
      });
      
      const totalCustomers = await this.primsaDB.customer.count();
      if(customers.length !== 0) {
        const result: CustomerApiResponse = {
          message: `Customers successfully retrieve`,
          customer: {
            allCustomers: customers,
            totalCustomers,
            totalPages: Math.ceil(totalCustomers) / customersPerPage 
          },
          statusCode: 200
        }
        this.logger.log(`Customers successfully retrieve`)
        return result;
      } else {
        const result: CustomerApiResponse = {
          message: `Customers empty`,
          statusCode: 404
        }
        this.logger.log(`Customers empty`)
        return result;
      }
    } catch (error) {
      console.log(error);
      const result: CustomerApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      this.logger.error(error);
      return result;
    }
  };

  async deleteCustomer(customerId: string): Promise<CustomerApiResponse> {
    try {
      const validCustomer = await this.primsaDB.customer.findUnique({
        where: {
          id: parseInt(customerId)
        }
      });
      if(validCustomer) {
        await this.primsaDB.customer.update({
          where: {
            id: validCustomer.id
          },
          data: {
            account_status: "inactive"
          }
        })
        const result: CustomerApiResponse = {
          message: `Account successfully disabled`,
          statusCode: 200
        }
        this.logger.log(`Customer requested to disabled account`);
        return result;
      } else {
        const result: CustomerApiResponse = {
          message: `Customer not valid`,
          statusCode: 404
        }
        this.logger.log(`Customer not valid`);
        return result;
      }
    } catch (error) {
      console.log(error);
      const result: CustomerApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      this.logger.error(error);
      return result;
    }
  }
}
