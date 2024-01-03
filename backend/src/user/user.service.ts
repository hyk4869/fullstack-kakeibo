import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewUser } from './dto/createUser.input';
import * as bcrypt from 'bcrypt';
import { CustomMessage } from './interfaces/messages';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createNewUser(postData: CreateNewUser): Promise<CustomMessage> {
    const { name, email, password } = postData;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const checkDuplicate = await this.prisma.user.findMany({
        where: {
          OR: [{ email: email }, { name: name }],
        },
      });

      if (checkDuplicate.length === 0) {
        await this.prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            lastLoginAt: new Date(),
          },
        });

        return {
          message: 'アカウントの作成に成功しました。リダイレクトします。',
          status: true,
        };
      } else {
        return {
          message: 'nameもしくは、emailが重複している可能性があります',
          status: false,
        };
      }
    } catch (error) {
      console.error('データベースへの書き込みエラー:', error);
      throw error;
    }
  }
}
