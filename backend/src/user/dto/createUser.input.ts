import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateNewUser {
  @IsNotEmpty()
  userID: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(16)
  password: string;
}
