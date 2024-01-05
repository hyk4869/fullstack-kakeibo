import { User } from '@prisma/client';

export interface CustomMessage {
  message: string;
  status: boolean;
}

export interface CustomMessageUser extends CustomMessage {
  user?: User;
}
