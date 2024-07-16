import { IsEmail, Length, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({message: 'Email is required'})
  @IsEmail()
  email: string;

  @IsNotEmpty({message: 'Password is required'})
  @Length(4, 8, {
    message: 'Password length min 4 and max 8'
  })
  password: string;

  @IsNotEmpty({message: 'Confirm password is required'})
  confirmPassword: string;
}