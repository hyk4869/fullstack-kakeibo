import { Injectable } from '@nestjs/common';
import { AuthDto, SignInResponse } from './dto/loginUser.input';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CustomMessageUser } from 'src/user/interfaces/messages';
import { MasterDataService } from 'src/master-data/master-data.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
    private readonly masterDataService: MasterDataService,
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
        ? { message: 'ログインに成功しました', status: true, user: findUser }
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
      const masterData = await this.masterDataService.getMasterData(userWithoutPassword.userID);

      return {
        token: this.jwtService.sign(payload),
        message: validationResult.message,
        user: { ...userWithoutPassword },
        status: true,
        masterData: masterData,
      };
    } else {
      return {
        message: validationResult.message,
        status: false,
      };
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const decoded = this.jwtService.verify(token);
      return !!decoded;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }
}
