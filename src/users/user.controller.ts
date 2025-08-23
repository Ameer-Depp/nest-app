/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  ParseIntPipe,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDTO } from './dtos/register.dto';
import { LoginDTO } from './dtos/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles, RolesOrOwner } from './decorators/roles.decorator';
import { UserType } from './user.entity';
import { updateUserDTO } from './dtos/updateUser.dto';

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

  // GET http://localhost:3000/api/users/profile
  @Get('profile')
  // the AuthGuard is responsible for a valid token, not only that he return a request that contains the decoded payload of the JWT
  // that will be used in the @Request parameter (we want only the id)
  @UseGuards(AuthGuard)
  // the @Request will get the returned request from the AuthGuard, and put it in the (req) parameter *you can name it whatever you want
  getProfile(@Request() req: any) {
    // the req contains the decoded payload from the AuthGuard who brought to req by the @Request
    // and then we only need the id cause this function request an id to execute
    return this.userService.getUserProfile(req.user.id);
  }

  // GET http://localhost:3000/api/users - ADMIN ONLY
  @Get()
  @UseGuards(AuthGuard, RolesGuard) // Both authentication and authorization
  @Roles(UserType.Admin) // Only Admin can access
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  // PUT http://localhost:3000/api/users/:id - ADMIN OR OWNER
  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @RolesOrOwner(UserType.Admin)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: updateUserDTO,
  ) {
    return this.userService.updateUser(id, body);
  }

  // DELETE http://localhost:3000/api/users/:id - ADMIN ONLY
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserType.Admin) // Only Admin can delete users
  public async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
    return { message: 'user Delete successfully' };
  }
}
