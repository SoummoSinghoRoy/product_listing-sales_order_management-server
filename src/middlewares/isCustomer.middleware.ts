import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IsCustomerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = req['user'];
    if(user && user.role === 'customer') {
      next()
    } else {
      const apiResponse = {
        message: `Access restricted`,
        statusCode: 403 
      }
      res.json(apiResponse);
    }
  }
}