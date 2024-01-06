import { User } from '@prisma/client';

export interface CustomMessage {
  message: string;
  status: boolean;
}

export interface CustomMessageUser extends CustomMessage {
  // user?: User;
  user?: {
    id?: string;
    userID: string;
    email: string;
    password?: string;
    color: string;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
  };
}
