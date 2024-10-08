import { IsNotEmpty } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto, UserApiResponse, UserDto } from "./user.dto";


export class CreateCustomerDto extends PartialType(CreateUserDto)  {
  @IsNotEmpty({ message: 'Contact no. is required' })
  contact_no: string;

  @IsNotEmpty({message: 'Address is required' })
  address: string;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}

export class CustomerApiResponse extends UserApiResponse {
  message: string;
  customer?: CustomerDto | AllCustomersDto;
  statusCode: number;
}

export class CustomerDto extends UserDto {
  contact_no?: string;
  address?: string;
}

export class AllCustomersDto {
  allCustomers: CustomerDto[];
  totalCustomers: number;
  totalPages: number;
}