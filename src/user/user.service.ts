import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UserApiResponse } from 'src/dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prismaDB: DatabaseService) {}
  async createUser(createReqData: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createReqData.password, 8);
      const user = await this.prismaDB.user.create({
        data: {
          name: createReqData.name,
          email: createReqData.email,
          password: hashedPassword
        }
      })
      const result: UserApiResponse = {
        message: `Signup successfully`,
        statusCode: 200,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
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
  async userLogin() {}
}
