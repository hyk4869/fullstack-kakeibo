import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { CustomMessageUser } from './interfaces/messages';
import { CreateNewUser } from './dto/createUser.input';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signUp')
  async createUser(@Body() postData: CreateNewUser): Promise<CustomMessageUser> {
    return this.userService.createNewUser(postData);
  }
}
