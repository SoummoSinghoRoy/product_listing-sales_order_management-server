enum Action {
  APPROVE = 'approve',
  REJECT = 'reject',
}

export class QueryReqEntitiesDto {
  action: Action;
  orderId: string;
}

export class SaleOrderCreateDto {
  paid: number;
  due?: number;
  payment_date: string
}

export class DtoValidationResult {
  error: object;
  isValid: boolean;
}

export class DueCheckReqBody {
  account_status: string;
  orderId: string;
}

export class DueUpdateReqDto {
  newPaidAmount: number;
  newDueAmount: number;
  payment_date: string;
}

export class DeliveryConfirmationReqDto {
  action: string = 'yes';
}

export class SaleOrderApiResponse {
  message: string;
  sale_order?: any;
  error?: object;
  statusCode: number;
}