import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDto, ProductApiResponse, UpdateStockApiResponse } from 'src/dto/product.dto';
import { unsyncUploadedFile } from 'src/utils/fileUnSync';

@Injectable()
export class ProductService {
  constructor(private prismaDB: DatabaseService) { }

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

  async findAllProducts(pageNumber: string): Promise<ProductApiResponse> {
    try {
      const productsPerPage = 30;
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
          totalPages: Math.ceil(totalProducts / productsPerPage)
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
      if (product) {
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
      } else {
        const result: ProductApiResponse = {
          message: `Product not found`,
          statusCode: 404
        }
        return result;
      }
    } catch (error) {
      console.log(error);
      const result: ProductApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  };

  async searchProduct(searchTerm: string): Promise<ProductApiResponse> {
    try {
      if(!searchTerm) {
        const result: ProductApiResponse = {
          message: `Use valid search term`,
          statusCode: 403
        }
        return result;
      }
      const products = await this.prismaDB.product.findMany({
        where: {
          OR: [
            {name: {contains: searchTerm}},
            {brand: {contains: searchTerm}},
            {sku: {contains: searchTerm}}
          ]
        }
      });
      if(products.length !== 0) {
        const result: ProductApiResponse = {
          message: `Products retrieved successfully`,
          statusCode: 200,
          product: products
        }
        return result;
      } else {
        const result: ProductApiResponse = {
          message: `Product not found`,
          statusCode: 404
        }
        return result;
      }
    } catch (error) {
      console.log(error);
      const result: ProductApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  };

  async updateProduct(productId: string, productEditReqData: CreateProductDto, productFile: Express.Multer.File): Promise<ProductApiResponse> {
    try {
      const product = await this.prismaDB.product.findUnique({
        where: {
          id: parseInt(productId)
        }
      });

      if (product) {
        unsyncUploadedFile(`./${product.thumbnail}`);

        const unitPrice_StringToNumber = parseInt(productEditReqData.unit_price);
        const salePrice_StringToNumber = parseInt(productEditReqData.sale_price);
        const quantity_StringToNumber = parseInt(productEditReqData.quantity);

        const updatedProduct = await this.prismaDB.product.update({
          where: {
            id: product.id
          },
          data: {
            name: productEditReqData.name,
            description: productEditReqData.description.length !== 0 ? productEditReqData.description : null,
            brand: productEditReqData.brand,
            unit_price: unitPrice_StringToNumber,
            sale_price: salePrice_StringToNumber,
            quantity: quantity_StringToNumber,
            measureType: productEditReqData.measureType,
            sku: productEditReqData.sku,
            thumbnail: `/upload/${productFile.filename}`
          }
        });

        const result: ProductApiResponse = {
          message: `Product updated successfully`,
          statusCode: 200,
          product: {
            id: updatedProduct.id,
            name: updatedProduct.name,
            brand: updatedProduct.brand,
            unit_price: updatedProduct.unit_price,
            sale_price: updatedProduct.sale_price,
            quantity: updatedProduct.quantity,
            measureType: updatedProduct.measureType,
            sku: updatedProduct.sku,
            description: updatedProduct.description,
            thumbnail: updatedProduct.thumbnail
          }
        }
        return result;
      } else {
        const result: ProductApiResponse = {
          message: `Product not found`,
          statusCode: 404
        }
        return result;
      }
    } catch (error) {
      console.log(error);
      const result: ProductApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  };

  async updateStock(productId: string, updatedStockQuanity: string): Promise<UpdateStockApiResponse> {
    try {
      const product = await this.prismaDB.product.findUnique({
        where: {
          id: parseInt(productId)
        }
      });
      if (product) {
        const quantity_StringToNumber = parseInt(updatedStockQuanity);
        const updatedStock = await this.prismaDB.product.update({
          where: {
            id: product.id
          },
          data: {
            quantity: quantity_StringToNumber + product.quantity
          }
        });
        const result: UpdateStockApiResponse = {
          message: `Stock updated successfully`,
          statusCode: 200,
          product: {
            id: updatedStock.id,
            name: updatedStock.name,
            quantity: updatedStock.quantity,
            sku: updatedStock.sku
          }
        }
        return result;
      } else {
        const result: UpdateStockApiResponse = {
          message: `Product not found`,
          statusCode: 404
        }
        return result;
      }
    } catch (error) {
      console.log(error);
      const result: UpdateStockApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  };

  async deleteProduct(productId: string) : Promise<ProductApiResponse> {
    try {
      const validProduct = await this.prismaDB.product.findUnique({
        where: {
          id: parseInt(productId)
        }
      });
      if(validProduct) {
        unsyncUploadedFile(`./${validProduct.thumbnail}`);
        await this.prismaDB.product.delete({
          where: {
            id: validProduct.id
          }
        });
        const result: ProductApiResponse = {
          message: `Product deleted successfully`,
          statusCode: 200
        }
        return result;
      } else {
        const result: ProductApiResponse = {
          message: `Product not found`,
          statusCode: 404
        }
        return result;
      }
    } catch (error) {
      const result: ProductApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      return result;
    }
  }
}
