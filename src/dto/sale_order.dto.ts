export class QueryReqEntitiesDto {
  action: string;
  orderId: string;
}

export class SaleOrderCreateDto {
  paid: number;
  due: number;
}

export class DtoValidationResult {
  error: object;
  isValid: boolean;
}

export class SaleOrderApiResponse {
  message: string;
  sale_order?: any;
  error?: object;
  statusCode: number;
}