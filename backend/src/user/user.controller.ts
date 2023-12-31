import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { CustomMessageUser } from './interfaces/messages';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signUp')
  async createUser(@Body() postData: User): Promise<CustomMessageUser> {
    return this.userService.createNewUser(postData);
  }
}
