import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  // validateUseメソッドを使用して認証を行う
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }
  /**validateメソッドは認証処理の中で自動的に呼ばれるものであり、メソッド名がvalidateである必要がある。変更しない */
  async validate(email: string, password: string): Promise<User> {
    /**emailとパスの検証を行う */
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
