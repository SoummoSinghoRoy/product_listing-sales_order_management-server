export class CreateCartDto {
  customerId?: string;
  productId: string;
  quantity: string;
}

export class DtoValidationResult {
  error: object;
  isValid: boolean;
}

export class AddToCartApiResponse {
  message: string;
  cart?: CartDto | CartDto[]
  error?: object;
  removedItemId?: number;
  statusCode: number;
}

export class CartDto {
  id: number;
  cartItems: any;
  added_date: string;
}

// export class CartProductDto {
//   id: number;
//   name: string;
//   sale_price: number;
//   measureType: string;
// }