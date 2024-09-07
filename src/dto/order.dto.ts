export class CreateOrderDto {
  shipping_address: string;
}

export class DtoValidationResult {
  error: object;
  isValid: boolean;
}

export class OrderApiResponse {
  message: string;
  order_details?: OrderDto | OrderDto[] | AllOrderDto;
  error?: object;
  statusCode: number;
}

export class OrderDto {
  id: number;
  customerId: number;
  cartId: number;
  order_amount: number;
  order_date: string;
  order_status: string; 
  shipping_address: string;
  payment_method: string;
}

export class AllOrderDto {
  allOrders: OrderDto[];
  totalOrders: number;
  totalPages: number;
}