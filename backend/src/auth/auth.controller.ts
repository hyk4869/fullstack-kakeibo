import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/loginUser.input';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServise: AuthService) {}

  @Post('/login')
  async postLogin(@Body() postData: AuthDto) {
    return this.authServise.postLogin(postData);
  }
}
