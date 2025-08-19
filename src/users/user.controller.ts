import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDTO } from './dtos/register.dto';
import { LoginDTO } from './dtos/login.dto';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // POST http://localhost:3000/api/users/auth/register
  @Post('auth/register')
  registerUser(@Body() body: RegisterDTO) {
    return this.userService.register(body);
  }

  // POST http://localhost:3000/api/users/auth/login
  @Post('auth/login')
  loginUser(@Body() body: LoginDTO) {
    return this.userService.login(body);
  }
}
