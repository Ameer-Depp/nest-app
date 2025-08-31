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
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  Res,
} from '@nestjs/common';
import type { Response } from 'express'; // <-- change this line
import { UserService } from './user.service';
import { RegisterDTO } from './dtos/register.dto';
import { LoginDTO } from './dtos/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles, RolesOrOwner } from './decorators/roles.decorator';
import { UserType } from './user.entity';
import { updateUserDTO } from './dtos/updateUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiSecurity } from '@nestjs/swagger';
import { ImageUploadDTO } from './dtos/image-upload.dto';

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
  @ApiSecurity('bearer')
  getProfile(@Request() req: any) {
    // the req contains the decoded payload from the AuthGuard who brought to req by the @Request
    // and then we only need the id cause this function request an id to execute
    return this.userService.getUserProfile(req.user.id);
  }

  // GET http://localhost:3000/api/users - ADMIN ONLY
  @Get()
  @UseGuards(AuthGuard, RolesGuard) // Both authentication and authorization
  @Roles(UserType.Admin) // Only Admin can access
  @ApiSecurity('bearer')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  // PUT http://localhost:3000/api/users/:id - ADMIN OR OWNER
  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @RolesOrOwner(UserType.Admin)
  @ApiSecurity('bearer')
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
  @ApiSecurity('bearer')
  public async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
    return { message: 'user Delete successfully' };
  }

  @Post('profile-image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profile-image')) // 👈 Must match DTO property name
  @ApiSecurity('bearer')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: ImageUploadDTO,
    description: 'Upload user profile image',
  })
  public uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!file) throw new BadRequestException('no image provided');
    return this.userService.uploadUserProfileImage(req.user.id, file.filename);
  }

  @Delete('profile-image/delete')
  @UseGuards(AuthGuard)
  @ApiSecurity('bearer')
  public removeUserProfileImage(@Request() req: any) {
    return this.userService.removeProfileImage(req.user.id);
  }

  // GET: ~/api/users/images/:image
  @Get('profile-image/:image')
  @UseGuards(AuthGuard)
  @ApiSecurity('bearer')
  public showProfileImage(@Param('image') image: string, @Res() res: Response) {
    return res.sendFile(image, { root: 'images/users' });
  }
}
