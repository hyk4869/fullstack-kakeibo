import { Body, Controller, Post, UseGuards, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, SignInResponse } from './dto/loginUser.input';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authServise: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * ログイン時に使用しているもの
   * @param postData
   * @returns
   */
  @Post('/login')
  async postLogin(@Body() postData: AuthDto): Promise<SignInResponse> {
    return this.authServise.postLogin(postData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getUser')
  async getUser(@Query('userID') userID: string): Promise<User> {
    return await this.userService.getUser(userID);
  }

  /**
   * リロード時に使用しているもの
   * @param authToken
   * @returns
   */
  @Post('/verifyToken')
  async verifyReloadToken(@Body('authToken') authToken: string): Promise<SignInResponse> {
    return await this.authServise.verifyReloadToken(authToken);
  }
}
