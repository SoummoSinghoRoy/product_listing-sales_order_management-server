import { Body, Controller, Delete, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { CartService } from './cart.service';
import { AddToCartApiResponse, CreateCartDto } from 'src/dto/cart.dto';
import { CartValidationService } from 'src/custom-validation/cart.validation';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService, private cartValidation: CartValidationService) {}
  @Post('/add')
  @UseGuards(AuthGuard)
  async addProductToCart(@Body() reqBody: CreateCartDto, @Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const validationResult = await this.cartValidation.productAddToCartValidation(reqBody);

      if (!validationResult.isValid) {
        const apiResponse: AddToCartApiResponse = {
          message: `Validation error`,
          error: validationResult.error,
          statusCode: 400,
        }
        res.json(apiResponse);
      } else {
        const user = req['user'];
        if (user.role === 'admin') {
          const result = await this.cartService.addToCart(reqBody);
          const apiResponse: AddToCartApiResponse = {
            message: result.message,
            cart: result.statusCode === 200 && result.cart,
            statusCode: result.statusCode,
          }
          res.json(apiResponse);
        } else if (user.role === 'customer') {
          const result = await this.cartService.addToCart(reqBody, user.customerId);
          const apiResponse: AddToCartApiResponse = {
            message: result.message,
            cart: result.statusCode === 200 && result.cart,
            statusCode: result.statusCode,
          }
          res.json(apiResponse);
        }
      }
    } catch (error) {
      console.log(error);
      const apiResponse: AddToCartApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  };

  @Delete('/remove/:cartItemId')
  @UseGuards(AuthGuard)
  async removeProductFromcart(@Param() params: any, @Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const result = await this.cartService.removeFromCart(params.cartItemId);
      const apiResponse: AddToCartApiResponse = {
        message: result.message,
        removedItemId: result.statusCode === 200 && result.removedItemId,
        statusCode: result.statusCode,
      }
      res.json(apiResponse);
    } catch (error) {
      console.log(error);
      const apiResponse: AddToCartApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  }
}
