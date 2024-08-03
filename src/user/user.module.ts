import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtAuthService } from '../jwt/jwt.service';

@Module({
  providers: [UserService, JwtAuthService],
  controllers: [UserController]
})
export class UserModule {}
