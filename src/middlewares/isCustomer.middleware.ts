import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtAuthService } from 'src/jwt/jwt.service';

@Injectable()
export class IsCustomerMiddleware implements NestMiddleware {
  constructor(private jwtAuthService: JwtAuthService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authorizedToken = req.headers['authorization'];
      const tokenParts = authorizedToken.split(' ');
      const token = tokenParts[1];
      if(token) {
        const payload = await this.jwtAuthService.verifyToken(token);
        if(payload && payload.role === 'customer') {
          req['user'] = payload;
          next()
        } else {
          const apiResponse = {
            message: `Access restricted`,
            statusCode: 403 
          }
          res.json(apiResponse);
        }
      }
      return false; 
    } catch (error) {
      console.log(error);
      const apiResponse: {
        message: string,
        statusCode: number
      } = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  }
}