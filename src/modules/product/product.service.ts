import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDto, ProductApiResponse } from 'src/dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private prismaDB: DatabaseService) {}

  async createProduct(productCreateReqData: CreateProductDto, productFile: Express.Multer.File): Promise<ProductApiResponse> {
    try {
      const unitPrice_StringToNumber = parseInt(productCreateReqData.unit_price);
      const salePrice_StringToNumber = parseInt(productCreateReqData.sale_price);
      const quantity_StringToNumber = parseInt(productCreateReqData.quantity);

      const product = await this.prismaDB.product.create({
        data: {
          name: productCreateReqData.name,
          description: productCreateReqData.description.length !== 0 ? productCreateReqData.description : null,
          brand: productCreateReqData.brand,
          unit_price: unitPrice_StringToNumber,
          sale_price: salePrice_StringToNumber,
          quantity: quantity_StringToNumber,
          measureType: productCreateReqData.measureType,
          sku: productCreateReqData.sku,
          thumbnail: `/upload/${productFile.filename}`
        }
      });
      const result: ProductApiResponse = {
        message: `Product created successfully`,
        statusCode: 200,
        product: {
          id: product.id,
          name: product.name,
          brand: product.brand,
          unit_price: product.unit_price,
          sale_price: product.sale_price,
          quantity: product.quantity,
          measureType: product.measureType,
          sku: product.sku,
          description: product.description,
          thumbnail: product.thumbnail
        }
      }
      return result;
    } catch (error) {
      console.log(error);
      const result: ProductApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  };
  async findAllProducts(pageNumber: string):Promise<ProductApiResponse> {
    try {
      const productsPerPage = 2;
      const page = parseInt(pageNumber) || 1;
      const products = await this.prismaDB.product.findMany({
        skip: (page - 1) * productsPerPage,
        take: productsPerPage
      });
      const totalProducts = await this.prismaDB.product.count();
      const result: ProductApiResponse = {
        message: `Products retrieved successfully`,
        statusCode: 200,
        product: {
          allProducts: products,
          totalProducts,
          totalPages: Math.ceil(totalProducts/productsPerPage)
        }
      }
      return result;
    } catch (error) {
      console.log(error);
      const result: ProductApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  };
  async findSingleProduct(productId: string): Promise<ProductApiResponse> {
    try {
      const product = await this.prismaDB.product.findUnique({
        where: {
          id: parseInt(productId)
        }
      });
      const result: ProductApiResponse = {
        message: `Product retrieved successfully`,
        statusCode: 200,
        product: {
          id: product.id,
          name: product.name,
          brand: product.brand,
          unit_price: product.unit_price,
          sale_price: product.sale_price,
          quantity: product.quantity,
          measureType: product.measureType,
          sku: product.sku,
          description: product.description,
          thumbnail: product.thumbnail
        }
      }
      return result;
    } catch (error) {
      console.log(error);
      const result: ProductApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  };
  async updateProduct(productId: string): Promise<ProductApiResponse> {
    try {
      
    } catch (error) {
      console.log(error);
      const result: ProductApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  }
}
