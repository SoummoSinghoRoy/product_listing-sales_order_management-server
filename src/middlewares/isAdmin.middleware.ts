import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IsAdminMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = req['user'];
    if(user && user.role === 'admin') {
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