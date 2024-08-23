import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AddToCartApiResponse, CreateCartDto } from 'src/dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prismaDB: DatabaseService) {}

  async addToCart(createReqData: CreateCartDto, customerId?: number): Promise<AddToCartApiResponse> {
    try {
      const validCustomer = await this.prismaDB.customer.findUnique({
        where: {
          id: customerId || parseInt(createReqData.customerId)
        }
      });

      if(validCustomer) {
        const validProduct = await this.prismaDB.product.findUnique({
          where: {
            id: parseInt(createReqData.productId)
          }
        });

        if(validProduct) {
          const addedProductToCart = await this.prismaDB.cartItem.create({
            data: {
              product: {
                connect: { id: validProduct.id }
              },
              customer: {
                connect: { id: validCustomer.id }
              },
              quantity: parseInt(createReqData.quantity),
              amount: parseInt(createReqData.quantity) * validProduct.sale_price,
            },
            include: {
              product: true
            }
          });

          const result: AddToCartApiResponse = {
            message: `Item added to cart`,
            cartItem: {
              id: addedProductToCart.id,
              product: {
                id: addedProductToCart.product.id,
                name: addedProductToCart.product.name,
                sale_price: addedProductToCart.product.sale_price,
                measureType: addedProductToCart.product.measureType
              },
              quantity: addedProductToCart.quantity,
              amount: addedProductToCart.amount
            },
            statusCode: 200
          };
          return result;
        } else {
          const result: AddToCartApiResponse = {
            message: `Product not valid`,
            statusCode: 404
          }
          return result;
        }
      } else {
        const result: AddToCartApiResponse = {
          message: `Customer not valid`,
          statusCode: 404
        }
        return result;
      }
    } catch (error) {
      console.log(error);
      const result: AddToCartApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  };

  // remove item from cart
}
