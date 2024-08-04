import { Body, Controller, Patch, Post, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto, UpdatePasswordDto, UserApiResponse } from 'src/dto/user.dto';
import { CustomValidationPipe } from 'src/pipes/validation-exception.pipes';
import { AuthGuard } from '../guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/sign-up')
  @UsePipes(CustomValidationPipe)
  async addUser(@Body() reqBody: CreateUserDto, @Req() req: Request, @Res() res: Response) {
    try {
      if (reqBody.password === reqBody.confirmPassword) {
        if(req.path === '/api/user/sign-up') {
          const userReqBody = { ...reqBody, role: 'admin' };
          const result = await this.userService.createUser(userReqBody);
          const apiResponse: UserApiResponse = {
            message: result.message,
            user: result.statusCode === 200 && result.user,
            statusCode: result.statusCode,
          }
          res.json(apiResponse);
        }
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
  };

  @Post('/login')
  @UsePipes(CustomValidationPipe)
  async loginUser(@Body() reqBody: LoginDto, @Res() res: Response) {
    try {
      const result = await this.userService.userLogin(reqBody);
      const apiResponse: UserApiResponse = {
        message: result.message,
        token: result.statusCode === 200 && result.token,
        statusCode: result.statusCode
      }
      res.json(apiResponse);
    } catch (error) {
      console.log(error);
      const apiResponse: UserApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  };

  @Post('/logout')
  @UseGuards(AuthGuard)
  async logoutUser(@Req() req: Request, @Res() res: Response) {
    try {
      if(req['user']) {
        delete req['user']; 
        const result = await this.userService.userLogout();
        const apiResponse: UserApiResponse = {
          message: result.message,
          authenticated: result.authenticated,
          statusCode: result.statusCode
        }
        res.json(apiResponse);
      } else {
        const apiResponse: UserApiResponse = {
          message: `Unauthorized user`,
          statusCode: 401
        }
        res.json(apiResponse);
      }
    } catch (error) {
      console.log(error);
    }
  };
  @Patch('/update')
  @UseGuards(AuthGuard)
  @UsePipes(CustomValidationPipe)
  async updatePassword(@Body() reqBody: UpdatePasswordDto, @Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.userService.userPasswordUpdate(reqBody, req['user'].email)
      const apiResponse: UserApiResponse = {
        message: result.message,
        statusCode: result.statusCode,
      }
      res.json(apiResponse);
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

