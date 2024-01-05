import { Injectable } from '@nestjs/common';
import { AuthDto, SignInResponse } from './dto/loginUser.input';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { CustomMessageUser } from 'src/user/interfaces/messages';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  /** ユーザーが正しいかどうかを判断するもの */
  async validateUser(postData: AuthDto): Promise<CustomMessageUser> {
    const findUser = await this.prisma.user.findUnique({
      where: {
        userID: postData.userID,
      },
    });
    if (findUser) {
      const comparePassword = await bcrypt.compare(postData.password, findUser.password);
      return comparePassword
        ? { message: '成功しました', status: true, user: findUser }
        : { message: 'userID もしくは パスワードが正しくありません', status: false };
    } else {
      return { message: 'アカウントが存在していない可能性があります', status: false };
    }
  }

  async postLogin(postData: AuthDto): Promise<SignInResponse> {
    const validationResult = await this.validateUser(postData);

    if (validationResult.status) {
      const payload = { username: postData.userID };
      const { password, id, ...userWithoutPassword } = validationResult.user;

      return {
        token: this.jwtService.sign(payload),
        message: validationResult.message,
        user: { ...userWithoutPassword },
      };
    } else {
      return {
        message: validationResult.message,
      };
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const decoded = this.jwtService.verify(token);
      return !!decoded;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }
}
