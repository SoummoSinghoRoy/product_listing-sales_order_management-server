export class OrderApiResponse {
  message: string;
  order_details?: OrderDto | OrderDto[];
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