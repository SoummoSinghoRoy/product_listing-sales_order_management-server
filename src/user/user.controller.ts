import { Body, Controller, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/sign-up')
  @UsePipes(new ValidationPipe({transform: true}))
  addUser(@Body() reqBody: CreateUserDto, @Res() res: Response) {
    console.log(reqBody);
  }
}

