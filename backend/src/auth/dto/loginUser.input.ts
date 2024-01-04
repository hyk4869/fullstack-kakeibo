import { IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  userID: string;

  @IsNotEmpty()
  password: string;
}
