export class CreateProductDto {
  name: string;
  brand: string;
  unit_price: string;
  sale_price: string;
  quantity: string;
  measureType: string;
  sku: string;
  description?: string;
}

export class DtoValidationResult {
  error: object;
  isValid: boolean;
}

export class ProductApiResponse {
  message: string;
  product?: ProductDto | AllProductsDto | ProductDto[]
  error?: object;
  statusCode: number;
}

export class ProductDto {
  id: number;
  name: string;
  description: string;
  brand: string;
  unit_price: number;
  sale_price: number;
  quantity: number;
  measureType: string;
  sku: string;
  thumbnail: string;
}

export class AllProductsDto {
  allProducts: ProductDto[];
  totalProducts: number;
  totalPages: number;
}

export class UpdateStockApiResponse {
  message: string;
  product?: {
    id: number;
    name: string;
    quantity: number;
    sku: string;
  };
  error?: object;
  statusCode: number;
}
