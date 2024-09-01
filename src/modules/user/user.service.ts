import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginDto, UpdatePasswordDto, UserApiResponse } from 'src/dto/user.dto';
import { JwtAuthService } from 'src/jwt/jwt.service';
import { CustomerApiResponse } from 'src/dto/customer.dto';

@Injectable()
export class UserService {
  constructor(
    private prismaDB: DatabaseService,
    private jwtService: JwtAuthService
  ) {}
  async createUser(createReqData: CreateUserDto): Promise<UserApiResponse> {
    try {
      const hashedPassword = await bcrypt.hash(createReqData.password, 8);
      const user = await this.prismaDB.user.create({
        data: {
          name: createReqData.name,
          email: createReqData.email,
          password: hashedPassword,
          role: createReqData.role
        }
      })
      const result: UserApiResponse = {
        message: `Signup successfully`,
        statusCode: 200,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
      return result;
    } catch (error) {
      console.log(error);
      const result: UserApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  };
  async userLogin(loginreqData: LoginDto): Promise<CustomerApiResponse | UserApiResponse> {
    try {
      const validUser = await this.prismaDB.user.findUnique({
        where: {
          email: loginreqData.email
        },
        include: {
          customer: true
        }
      });      
      if(validUser) {
        const match = await bcrypt.compare(loginreqData.password, validUser.password);
        if(match) {
          if(validUser.role === 'customer' && validUser.customer.account_status === "active") {

            const payload = {
              id: validUser.id,
              customerId: validUser.customer.id,
              name: validUser.name,
              email: validUser.email,
              role: validUser.role
            }
            const token = await this.jwtService.generateToken(payload);
            const result: CustomerApiResponse = {
              message: `Logged in successfully`,
              token: `Bearer ${token}`,
              authenticated: true,
              statusCode: 200
              // here will be include order & cart of customer
            }
            return result;
          } else if(validUser.role === 'customer' && validUser.customer.account_status !== "active") {
            const result: UserApiResponse = {
              message: `Your account isn't active. Please contact with support for re-active`,
              statusCode: 403
            }
            return result;
          } else if(validUser.role === 'admin') {
            const payload = {
              id: validUser.id,
              name: validUser.name,
              email: validUser.email,
              role: validUser.role
            }
            const token = await this.jwtService.generateToken(payload);
            const result: UserApiResponse = {
              message: `Logged in successfully`,
              token: `Bearer ${token}`,
              authenticated: true,
              statusCode: 200
            }
            return result;
          }
        } else {
          const result: UserApiResponse = {
            message: `Incorrect password`,
            statusCode: 401
          }
          return result; 
        }
      } else {
        const result: UserApiResponse = {
          message: `Email is wrong`,
          statusCode: 401
        }
        return result;
      }
    } catch (error) {
      console.log(error);
      const result: UserApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  };
  async userLogout(): Promise<UserApiResponse> {
    try {
      const result: UserApiResponse = {
        message: `Successfully loggedout`,
        authenticated: false,
        statusCode: 200
      }
      return result;
    } catch (error) {
      console.log(error);
      const result: UserApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  }

  async userPasswordUpdate(updateReqData: UpdatePasswordDto, userId: string): Promise<UserApiResponse> {
    try {
      const validUser = await this.prismaDB.user.findUnique({
        where: {
          id: parseInt(userId)
        }
      });
      if(validUser) {
        const match = await bcrypt.compare(updateReqData.oldPassword, validUser.password);
        if(match) {
          const hashedPassword = await bcrypt.hash(updateReqData.newPassword, 8);
          await this.prismaDB.user.update({
            where: {
              email: validUser.email
            },
            data: {
              password: hashedPassword
            }
          });
          const result: UserApiResponse = {
            message: `Updated successfully`,
            statusCode: 200
          }
          return result;
        } else {
          const result: UserApiResponse = {
            message: `Incorrect password`,
            statusCode: 404
          }
          return result; 
        }
      }
    } catch (error) {
      console.log(error);
      const result: UserApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  }
}
