import { User } from '@prisma/client';
import { IsNotEmpty, MinLength } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  userID: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export interface UserWithoutPassword {
  userID: string;
  email: string;
  color: string;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
export class SignInResponse {
  token?: string;
  message: string;
  user?: UserWithoutPassword;
  status?: boolean;
}
