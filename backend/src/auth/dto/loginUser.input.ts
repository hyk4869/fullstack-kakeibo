import { IsNotEmpty, MinLength } from 'class-validator';
import { MasterData } from 'src/master-data/interface/masterDataInterface';

export class AuthDto {
  @IsNotEmpty()
  userID: string;

  @IsNotEmpty()
  @MinLength(6)
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
  masterData?: MasterData;
}

export class VerifyUserID {
  @IsNotEmpty()
  userID: string;
}
