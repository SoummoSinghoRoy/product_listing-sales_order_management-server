import { IsEmail, Length, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { IsEmailExist } from 'src/custom-validation/IsEmailExist';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({message: 'Email is required'})
  @IsEmail()
  @IsEmailExist({
    message: 'Email already used'
  })
  email: string;

  @IsNotEmpty({message: 'Password is required'})
  @Length(4, 8, {
    message: 'Password length min 4 and max 8'
  })
  password: string;

  @IsNotEmpty({message: 'Confirm password is required'})
  confirmPassword: string;

  role: string;
}

export class LoginDto extends PartialType(CreateUserDto) {
  @IsNotEmpty({message: 'Email is required'})
  email: string;

  @IsNotEmpty({message: 'Password is required'})
  password: string;
}

export class UpdatePasswordDto {
  @IsNotEmpty({message: 'Previous password is required'})
  oldPassword: string;

  @IsNotEmpty({message: 'New Password is required'})
  @Length(4, 8, {
    message: 'Password length min 4 and max 8'
  })
  newPassword: string;
}

export class UserApiResponse {
  message: string;
  user?: UserDto;
  token?: string;
  statusCode: number;
  authenticated?: true | false;
}

export class UserDto {
  id: number;
  name?: string;
  email?: string;
  role?: string;
}