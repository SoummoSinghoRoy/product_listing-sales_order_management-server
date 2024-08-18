import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsEmailExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prismaDB: DatabaseService) {}
  async validate(email: string, args: ValidationArguments) {
    try {
      const user: object | null = await this.prismaDB.user.findUnique({
        where: {
          email: email
        }
      });
      if (user) return false;
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export function IsEmailExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {    
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailExistConstraint
    })
  }
}

