import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import { JwtPayload } from '../interfaces/jwtPayload.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: JwtPayload): Promise<User | null> {
    return await this.userService.getUser(payload.username);
  }
}
