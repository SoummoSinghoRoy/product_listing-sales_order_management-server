import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtAuthService } from './jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    JwtModule.register({
      global: true,
      secret: process.env.SECRET
    })
  ],
  providers: [UserService, JwtAuthService],
  controllers: [UserController]
})
export class UserModule {}
