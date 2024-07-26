import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto, UserApiResponse } from 'src/dto/user.dto';
import { CustomValidationPipe } from 'src/pipes/validation-exception.pipes';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/sign-up')
  @UsePipes(CustomValidationPipe)
  async addUser(@Body() reqBody: CreateUserDto, @Res() res: Response) {
    try {
      if (reqBody.password === reqBody.confirmPassword) {
        const result = await this.userService.createUser(reqBody);
        const apiResponse: UserApiResponse = {
          message: result.message,
          user: result.statusCode === 200 && result.user,
          statusCode: result.statusCode,
        }
        res.json(apiResponse);
      } else {
        const apiResponse: UserApiResponse = {
          message: `Confirm password doesn't match with password`,
          statusCode: 400
        }
        res.json(apiResponse);
      }
    } catch (error) {
      console.log(error);
      const apiResponse: UserApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  }
}

