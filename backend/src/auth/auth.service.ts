import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/loginUser.input';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { CustomMessage } from 'src/user/interfaces/messages';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  /** ユーザーが正しいかどうかを判断するもの */
  async validateUser(postData: AuthDto): Promise<CustomMessage> {
    const findUser = await this.prisma.user.findUnique({
      where: {
        userID: postData.userID,
      },
    });
    if (findUser) {
      const comparePassword = await bcrypt.compare(postData.password, findUser.password);
      return comparePassword
        ? { message: '成功', status: true }
        : { message: 'userID もしくは パスワードが正しくありません', status: false };
    } else {
      return { message: 'アカウントが存在していない可能性があります', status: false };
    }
  }

  async postLogin(postData: AuthDto) {
    const validationResult = await this.validateUser(postData);

    if (validationResult.status) {
      const payload = { username: postData.userID };
      return {
        token: this.jwtService.sign(payload),
        message: validationResult.message,
      };
    } else {
      return {
        message: validationResult.message,
      };
    }
  }
}
