import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDTO } from './dtos/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { updateUserDTO } from './dtos/updateUser.dto';
import { unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * CREATE NEW USER
   * @param dto - RegisterDTO containing user registration data
   * @returns JWT access token
   */
  public async register(dto: RegisterDTO) {
    const { email, password, userName } = dto;

    const userFromDB = await this.userRepository.findOne({ where: { email } });
    if (userFromDB) {
      throw new BadRequestException('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser = this.userRepository.create({
      email,
      userName,
      password: hashedPassword,
    });

    newUser = await this.userRepository.save(newUser);

    const payload = { id: newUser.id, userType: newUser.userType };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  /**
   * LOGIN USER
   * @param dto - LoginDTO containing email and password
   * @returns JWT access token
   */
  public async login(dto: LoginDTO) {
    const { email, password } = dto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, userType: user.userType };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  /**
   * GET USER PROFILE
   * @param id - User ID from JWT payload
   * @returns User profile data
   */
  public async getUserProfile(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException('Account does not exist');
    }

    return user;
  }

  /**
   * GET ALL USERS - ADMIN ONLY
   * @returns Object containing users array and total count
   */
  public async getAllUsers() {
    const users = await this.userRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      users,
      total: users.length,
    };
  }

  /**
   * UPDATE USER
   * @param id - User ID to update
   * @param dto - updateUserDTO containing fields to update
   * @returns Updated user data
   */
  public async updateUser(id: number, dto: updateUserDTO) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    if (dto.userName !== undefined) {
      user.userName = dto.userName;
    }

    if (dto.email !== undefined) {
      if (dto.email !== user.email) {
        const existingUser = await this.userRepository.findOne({
          where: { email: dto.email },
        });
        if (existingUser) {
          throw new BadRequestException('Email is already taken');
        }
      }
      user.email = dto.email;
    }

    const updatedUser = await this.userRepository.save(user);

    return updatedUser;
  }

  /**
   * DELETE USER
   * @param id - User ID to delete
   */
  public async deleteUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    await this.userRepository.remove(user);
  }

  /**
   * upload user profile Image
   * @param userId
   * @param userProfileImage
   * @returns user data from the user table
   */
  public async uploadUserProfileImage(
    userId: number,
    userProfileImage: string,
  ) {
    const user = await this.getUserProfile(userId);
    if (user.profileImage === null) {
      user.profileImage = userProfileImage;
    } else {
      await this.removeProfileImage(userId);
      user.profileImage = userProfileImage;
    }

    return this.userRepository.save(user);
  }

  /**
   * DELETE USER PROFILE IMAGE
   * @param userId
   * @returns nothing
   */
  public async removeProfileImage(userId: number) {
    const user = await this.getUserProfile(userId);
    if (user.profileImage === null) {
      throw new BadRequestException('there is not profile image');
    }

    const imagePath = join(
      process.cwd(),
      `./images/users/${user.profileImage}`,
    );
    unlinkSync(imagePath);

    user.profileImage = null;
    return this.userRepository.save(user);
  }
}
