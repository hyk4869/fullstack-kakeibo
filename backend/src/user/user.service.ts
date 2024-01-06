import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewUser } from './dto/createUser.input';
import * as bcrypt from 'bcrypt';
import { CustomMessageUser } from './interfaces/messages';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createNewUser(postData: CreateNewUser): Promise<CustomMessageUser> {
    const { userID, email, password } = postData;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const checkDuplicate = await this.prisma.user.findMany({
        where: {
          OR: [{ email: email }, { userID: userID }],
        },
      });

      if (checkDuplicate.length === 0) {
        const createdUser = await this.prisma.user.create({
          data: {
            userID,
            email,
            password: hashedPassword,
            lastLoginAt: new Date(),
          },
        });

        const { id, password, ...userAccount } = createdUser;
        return {
          message: 'アカウントの作成に成功しました。\nメインページに移動しますか？',
          status: true,
          user: userAccount,
        };
      } else {
        return {
          message: 'userIDもしくは、emailが重複しています',
          status: false,
        };
      }
    } catch (error) {
      console.error('データベースへの書き込みエラー:', error);
      throw error;
    }
  }

  async getUser(userID: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { userID: userID },
    });
  }
}
