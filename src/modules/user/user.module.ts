import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtAuthService } from '../../jwt/jwt.service';
import { IsAdminMiddleware } from 'src/middlewares/isAdmin.middleware';
import { WinstonLogger } from 'src/logger/winston-logger.service';

@Module({
  providers: [UserService, JwtAuthService, WinstonLogger],
  controllers: [UserController]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
            .apply(IsAdminMiddleware)
            .forRoutes(
              { path: 'user/update/:id', method: RequestMethod.PATCH }
            )
  }
}
