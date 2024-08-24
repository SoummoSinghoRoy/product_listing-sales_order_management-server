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
  cart?: CartDto | CartDto[]
  error?: object;
  statusCode: number;
}

export class CartDto {
  id: number;
  product: any;
  added_date: any;
}

// export class CartProductDto {
//   id: number;
//   name: string;
//   sale_price: number;
//   measureType: string;
// }