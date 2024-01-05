import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { AuthDto } from '../dto/loginUser.input';
import { CustomMessageUser } from 'src/user/interfaces/messages';
import { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  // validateUseメソッドを使用して認証を行う
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'userID' });
  }
  /**validateメソッドは認証処理の中で自動的に呼ばれるものであり、メソッド名がvalidateである必要がある。変更しない */
  async validate(userID: string, password: string): Promise<User> {
    const makeObj: AuthDto = { userID: userID, password: password };
    /**emailとパスの検証を行う */
    const user = await this.authService.validateUser(makeObj);
    const { message, status, ...userData } = user;

    if (!userData) {
      throw new UnauthorizedException();
    }
    return userData.user;
  }
}
