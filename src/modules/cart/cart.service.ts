import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { DatabaseService } from 'src/database/database.service';
import { AddToCartApiResponse, CreateCartDto } from 'src/dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prismaDB: DatabaseService) { }

  async addToCart(createReqData: CreateCartDto, customerId?: number): Promise<AddToCartApiResponse> {
    try {
      const validCustomer = await this.prismaDB.customer.findUnique({
        where: {
          id: customerId || parseInt(createReqData.customerId)
        }
      });

      if (validCustomer) {
        const date = moment().tz('Asia/Dhaka').format('YYYY-MM-DD');

        const validProduct = await this.prismaDB.product.findUnique({
          where: {
            id: parseInt(createReqData.productId)
          }
        });

        if (validProduct) {
          const customerCart = await this.prismaDB.cart.findFirst({
            where: {
              customerId: validCustomer.id,
              cart_status: 'pending'
            }
          });
          // need to test for generate new cart for same customer. 

          if (!customerCart) {
            const createdCart = await this.prismaDB.cart.create({
              data: {
                customerId: validCustomer.id,
                added_date: date
              }
            });
            const addedCartItem = await this.prismaDB.cartItem.create({
              data: {
                productId: validProduct.id,
                quantity: parseInt(createReqData.quantity),
                amount: parseInt(createReqData.quantity) * validProduct.sale_price,
                cartId: createdCart.id
              },
              include: {
                product: true,
                cart: true,
              }
            });

            if (addedCartItem) {
              await this.prismaDB.product.update({
                where: {
                  id: addedCartItem.productId
                },
                data: {
                  quantity: validProduct.quantity - addedCartItem.quantity
                }
              });
            }
            const result: AddToCartApiResponse = {
              message: `Item added to cart`,
              cart: {
                id: addedCartItem.cartId,
                customerId: addedCartItem.cart.customerId,
                cartItems: addedCartItem,
                added_date: addedCartItem.cart.added_date
              },
              statusCode: 200
            };
            return result;
          } else if(customerCart && (customerCart.cart_status !== "pending" && customerCart.cart_status === "done")) {
            const createdCart = await this.prismaDB.cart.create({
              data: {
                customerId: validCustomer.id,
                added_date: date,
                cart_status: 'pending'
              }
            });

            const addedCartItem = await this.prismaDB.cartItem.create({
              data: {
                productId: validProduct.id,
                quantity: parseInt(createReqData.quantity),
                amount: parseInt(createReqData.quantity) * validProduct.sale_price,
                cartId: createdCart.id
              },
              include: {
                product: true,
                cart: true,
              }
            });

            if (addedCartItem) {
              await this.prismaDB.product.update({
                where: {
                  id: addedCartItem.productId
                },
                data: {
                  quantity: validProduct.quantity - addedCartItem.quantity
                }
              });
              const result: AddToCartApiResponse = {
                message: `Item added to cart`,
                cart: {
                  id: addedCartItem.cartId,
                  customerId: addedCartItem.cart.customerId,
                  cartItems: addedCartItem,
                  added_date: addedCartItem.cart.added_date,
                },
                statusCode: 200
              };
              return result;
            }
          } else {
            const addedCartItem = await this.prismaDB.cartItem.create({
              data: {
                productId: validProduct.id,
                quantity: parseInt(createReqData.quantity),
                amount: parseInt(createReqData.quantity) * validProduct.sale_price,
                cartId: customerCart.id
              },
              include: {
                product: true,
                cart: true,
              }
            });
            if (addedCartItem) {
              await this.prismaDB.product.update({
                where: {
                  id: validProduct.id
                },
                data: {
                  quantity: validProduct.quantity - addedCartItem.quantity
                }
              });
            }
          
            const result: AddToCartApiResponse = {
              message: `Item added to cart`,
              cart: {
                id: addedCartItem.cartId,
                customerId: addedCartItem.cart.customerId,
                cartItems: addedCartItem,
                added_date: addedCartItem.cart.added_date
              },
              statusCode: 200
            };
            return result;
          }
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

  async retrieveCartDetails(cartId: string): Promise<AddToCartApiResponse> {
    try {
      const cartDetails = await this.prismaDB.cart.findUnique({
        where: {
          id: parseInt(cartId),
          cart_status: 'pending'
        },
        include: {
          cart_items: true,
          customer: true,
          order: true
        }
      });

      if (cartDetails && (cartDetails.order?.order_status !== "accepted" && cartDetails.order?.order_status !== "ongoing")) {
        const result: AddToCartApiResponse = {
          message: `Cart items found`,
          cart: {
            id: cartDetails.id,
            customerId: cartDetails.customerId,
            cartItems: cartDetails.cart_items,
            added_date: cartDetails.added_date
          },
          statusCode: 200
        }
        return result;
      } else {
        const result: AddToCartApiResponse = {
          message: `Cart is empty`,
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

  async removeFromCart(cartItemId: string) {
    try {
      const validCartItem = await this.prismaDB.cartItem.findUnique({
        where: {
          id: parseInt(cartItemId)
        }
      });

      if (validCartItem) {
        const deletedItem = await this.prismaDB.cartItem.delete({
          where: {
            id: parseInt(cartItemId)
          }
        });

        const product = await this.prismaDB.product.findUnique({
          where: {
            id: validCartItem.productId
          }
        });

        await this.prismaDB.product.update({
          where: {
            id: deletedItem.productId
          },
          data: {
            quantity: product.quantity + deletedItem.quantity
          }
        })

        const customerCart = await this.prismaDB.cart.findUnique({
          where: {
            id: validCartItem.cartId
          },
          include: {
            cart_items: true
          }
        });

        if (customerCart.cart_items.length === 0) {
          await this.prismaDB.cart.delete({
            where: {
              id: customerCart.id
            }
          });
        }

        const result: AddToCartApiResponse = {
          message: `Item removed from cart`,
          removedItemId: deletedItem.id,
          statusCode: 200
        };
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
}


/*else if(customerCart && customerCart.cart_status === "pending") {
            const addedCartItem = await this.prismaDB.cartItem.create({
              data: {
                productId: validProduct.id,
                quantity: parseInt(createReqData.quantity),
                amount: parseInt(createReqData.quantity) * validProduct.sale_price,
                cartId: customerCart.id
              },
              include: {
                product: true,
                cart: true,
              }
            });
          
            if (addedCartItem) {
              await this.prismaDB.product.update({
                where: {
                  id: validProduct.id
                },
                data: {
                  quantity: validProduct.quantity - addedCartItem.quantity
                }
              });
            }
          
            const result: AddToCartApiResponse = {
              message: `Item added to cart`,
              cart: {
                id: addedCartItem.cartId,
                customerId: addedCartItem.cart.customerId,
                cartItems: addedCartItem,
                added_date: addedCartItem.cart.added_date
              },
              statusCode: 200
            };
            return result;
          } else if(customerCart && customerCart.cart_status !== "pending") {
            const createdCart = await this.prismaDB.cart.create({
              data: {
                customerId: validCustomer.id,
                added_date: date,
                cart_status: 'pending'
              }
            });

            const addedCartItem = await this.prismaDB.cartItem.create({
              data: {
                productId: validProduct.id,
                quantity: parseInt(createReqData.quantity),
                amount: parseInt(createReqData.quantity) * validProduct.sale_price,
                cartId: createdCart.id
              },
              include: {
                product: true,
                cart: true,
              }
            });

            if (addedCartItem) {
              await this.prismaDB.product.update({
                where: {
                  id: addedCartItem.productId
                },
                data: {
                  quantity: validProduct.quantity - addedCartItem.quantity
                }
              });
              const result: AddToCartApiResponse = {
                message: `Item added to cart`,
                cart: {
                  id: addedCartItem.cartId,
                  customerId: addedCartItem.cart.customerId,
                  cartItems: addedCartItem,
                  added_date: addedCartItem.cart.added_date,
                },
                statusCode: 200
              };
              return result;
            }
          }*/
