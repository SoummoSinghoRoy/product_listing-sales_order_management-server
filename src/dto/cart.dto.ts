export class CreateCartDto {
  customerId?: string;
  productId: string;
  quantity: string;
  amount: string;
}

export class DtoValidationResult {
  error: object;
  isValid: boolean;
}

export class AddToCartApiResponse {
  message: string;
  cartItem?: CartItemDto
  error?: object;
  statusCode: number;
}

export class CartItemDto {
  id: number;
  product: CartProductDto;
  quantity: number;
  amount: number;
}

export class CartProductDto {
  id: number;
  name: string;
  sale_price: number;
  measureType: string;
}