import { Body, Controller, Get, Param, Post, Put, Query, Res, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common';
import { Response, Express } from 'express';
import { ProductService } from './product.service';
import { CreateProductDto, ProductApiResponse } from 'src/dto/product.dto';
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
      console.log(params.id);
    } catch (error) {
      console.log(error);
      const apiResponse: ProductApiResponse = {
        message: `Internal server error`,
        statusCode: 500
      }
      res.json(apiResponse);
    }
  }

  // here need to implement stock quanity update functionality. For update quanity only take product id.
  // when quantity will be updated updated quanity number will be merged or concat with previous quanity.
}
