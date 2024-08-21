import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreateProductDto, DtoValidationResult } from "src/dto/product.dto";

@Injectable()
export class ProductValidationService {
  constructor(private readonly prismaDB: DatabaseService) {}

  private async baseValidation(reqBody: CreateProductDto, reqFile: any, checkExistingProduct: boolean): Promise<DtoValidationResult> {
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

    if(checkExistingProduct) {
      const existProduct = await this.prismaDB.product.findUnique({
        where: {
          name: reqBody.name
        }
      });
      if(existProduct) {
        error.name = `Product already exist`
      }
    }

    return {
      error,
      isValid: Object.keys(error).length === 0
    }
  };

  async createProductValidation(createReqBody: CreateProductDto, createReqFile: any): Promise<DtoValidationResult> {
    return this.baseValidation(createReqBody, createReqFile, true);
  }

  async editProductValdiation(editReqBody: CreateProductDto, editReqFile: any): Promise<DtoValidationResult> {
    return this.baseValidation(editReqBody, editReqFile, false);
  }

  async updateStockValidation(quantity: string): Promise<DtoValidationResult> {
    let error: { [field: string]: string } = {};

    if (!quantity) {
      error.quantity = `Quantity is required`;
    } else if (parseInt(quantity) < 0) {
      error.quantity = `Quantity cannot be negative`;
    }

    return {
      error,
      isValid: Object.keys(error).length === 0,
    };
  }

}

export default ProductValidationService;