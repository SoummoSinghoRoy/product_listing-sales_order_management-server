import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreateProductDto, DtoValidationResult } from "src/dto/product.dto";

@Injectable()
export class ProductValidationService {
  constructor(private readonly prismaDB: DatabaseService) {}

  async createValidation(reqBody: CreateProductDto, reqFile: any): Promise<DtoValidationResult> {
    let error: { [field: string]: string } = {};

    if(!reqBody.name) {
      error.name = `Name is required`
    }

    if(!reqBody.brand) {
      error.brand = `Brand is required`
    }

    if(!reqBody.unit_price) {
      error.unit_price = `Unit price is required`
    }

    if(!reqBody.sale_price) {
      error.sale_price = `Sale price is required`
    }

    if(!reqBody.quantity) {
      error.quantity = `Quantity is required`
    }

    if(!reqBody.measureType) {
      error.measureType = `Measurement type is required`
    }

    if(!reqBody.sku) {
      error.sku = `SKU is required`
    }

    if(!reqFile) {
      error.thumbnail = `Thumbnail is required`
    }

    const existProduct = await this.prismaDB.product.findUnique({
      where: {
        name: reqBody.name
      }
    });
    if(existProduct) {
      error.name = `Product already exist`
    }

    return {
      error,
      isValid: Object.keys(error).length === 0
    }
  }
}

export default ProductValidationService;