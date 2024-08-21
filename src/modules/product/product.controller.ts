import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, Res, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common';
import { Response, Express } from 'express';
import { ProductService } from './product.service';
import { CreateProductDto, ProductApiResponse, UpdateStockApiResponse } from 'src/dto/product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/multer/storage';
import { ProductValidationService } from 'src/custom-validation/product.validation';
import { unsyncUploadedFile } from 'src/utils/fileUnSync';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService, private productValidationService: ProductValidationService) {}

  @Post('/add')
  @UseInterceptors(FileInterceptor('thumbnail', {storage}))
  async addProduct (@UploadedFile() file: Express.Multer.File, @Body() reqBody: CreateProductDto, @Res() res: Response): Promise<void> {
    try {
      const validationResult = await this.productValidationService.createProductValidation(reqBody, file);
      if(!file && !validationResult.isValid) {
        const apiResponse: ProductApiResponse = {
          message: `Validation error`,
          error: validationResult.error,
          statusCode: 400,
        }
        res.json(apiResponse);
      } else if(file && !validationResult.isValid) {
        unsyncUploadedFile(file.path);
        const apiResponse: ProductApiResponse = {
          message: `Validation error`,
          error: validationResult.error,
          statusCode: 400,
        }
        res.json(apiResponse);
      } else {
        if(file && file.size > 1 * 1024 * 500) {
          unsyncUploadedFile(file.path);
          const apiResponse: ProductApiResponse = {
            message: `Validation error`,
            error: {thumbnail: `Thumbnail size must be less than 500KB`},
            statusCode: 400,
          }
          res.json(apiResponse);
        }
        const result = await this.productService.createProduct(reqBody, file);  
        const apiResponse: ProductApiResponse = {
          message: result.message,
          product: result.statusCode === 200 && result.product,
          statusCode: result.statusCode,
        }
        res.json(apiResponse);
      }
    } catch (error) {
      console.log(error);
      if(file) unsyncUploadedFile(file.path);
      const apiResponse: ProductApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  };
  @Get('/all')
  async getAllProducts(@Query('pageNumber') pageNumber: string, @Res() res: Response): Promise<void> {
    try {
      const result = await this.productService.findAllProducts(pageNumber);
      const apiResponse: ProductApiResponse = {
        message: result.message,
        product: result.statusCode === 200 && result.product,
        statusCode: result.statusCode,
      }
      res.json(apiResponse);
    } catch (error) {
      console.log(error);
      const apiResponse: ProductApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  };

  @Get('/single/:id')
  async getSingleProduct(@Param() params: any, @Res() res: Response): Promise<void> {
    try {
      const result = await this.productService.findSingleProduct(params.id);
      const apiResponse: ProductApiResponse = {
        message: result.message,
        product: result.statusCode === 200 && result.product,
        statusCode: result.statusCode,
      }
      res.json(apiResponse);
    } catch (error) {
      console.log(error);
      const apiResponse: ProductApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  };

  @Put('/edit/:id')
  @UseInterceptors(FileInterceptor('thumbnail', {storage}))
  async editProduct(@Param() params: any, @UploadedFile() file: Express.Multer.File, @Body() reqBody: CreateProductDto, @Res() res: Response): Promise<void> {
    try {
      const validProduct = await this.productService.findSingleProduct(params.id);

      if(validProduct.statusCode === 200) {
        const validationResult = await this.productValidationService.editProductValdiation(reqBody, file);

        if(!file && !validationResult.isValid) {
          const apiResponse: ProductApiResponse = {
            message: `Validation error`,
            error: validationResult.error,
            statusCode: 400,
          }
          res.json(apiResponse);
        } else if(file && !validationResult.isValid) {
          unsyncUploadedFile(file.path);
          const apiResponse: ProductApiResponse = {
            message: `Validation error`,
            error: validationResult.error,
            statusCode: 400,
          }
          res.json(apiResponse);
        } else {
          if(file && file.size > 1 * 1024 * 500) {
            unsyncUploadedFile(file.path);
            const apiResponse: ProductApiResponse = {
              message: `Validation error`,
              error: {thumbnail: `Thumbnail size must be less than 500KB`},
              statusCode: 400,
            }
            res.json(apiResponse);
          }

          const result = await this.productService.updateProduct(params.id, reqBody, file);
          const apiResponse: ProductApiResponse = {
            message: result.message,
            product: result.statusCode === 200 && result.product,
            statusCode: result.statusCode,
          }
          res.json(apiResponse);
        }
      } else {
        const apiResponse: ProductApiResponse = {
          message: validProduct.message,
          statusCode: validProduct.statusCode,
        }
        res.json(apiResponse);
      }
    } catch (error) {
      console.log(error);
      if(file) unsyncUploadedFile(file.path);
      const apiResponse: ProductApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  };

  @Patch('/edit/stock/:id')
  async updateStock(@Param() params: any, @Body() quanityReq: object, @Res() res: Response): Promise<void> {
    const quanity = quanityReq['quantity'];
    try {
      const validProduct = await this.productService.findSingleProduct(params.id);

      if(validProduct.statusCode === 200) {
        const validationResult = await this.productValidationService.updateStockValidation(quanity);

        if(!validationResult.isValid) {
          const apiResponse: ProductApiResponse = {
            message: `Validation error`,
            error: validationResult.error,
            statusCode: 400,
          }
          res.json(apiResponse);
        } else {
          const result = await this.productService.updateStock(params.id, quanity);
          const apiResponse: UpdateStockApiResponse = {
            message: result.message,
            product: result.statusCode === 200 && result.product,
            statusCode: result.statusCode,
          }
          res.json(apiResponse);
        }
      } else {
        const apiResponse: UpdateStockApiResponse = {
          message: validProduct.message,
          statusCode: validProduct.statusCode,
        }
        res.json(apiResponse);
      }
    } catch (error) {
      console.log(error);
      const apiResponse: ProductApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  };

  @Delete('/delete/:id')
  async deleteProduct(@Param() params: any, @Res() res: Response): Promise<void> {
    try {
      const result = await this.productService.deleteProduct(params.id);
      const apiResponse: ProductApiResponse = {
        message: result.message,
        statusCode: result.statusCode
      }
      res.json(apiResponse);
    } catch (error) {
      console.log(error);
      const apiResponse: ProductApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  }
}
