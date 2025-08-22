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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * CREATE NEW USER
   * @param RegisterDTO
   * @returns JWT (ACCESS)
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
   * @param LoginDTO
   * @returns JWT (ACCESS)
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

    return { user };
  }

  // Add this method to your existing UserService class

  /**
   * GET ALL USERS - ADMIN ONLY
   * @returns List of all users (without passwords)
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
   * @param updateUserDTO
   * @returns updated user data
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  /**
   * DELETE USER
   * @param
   */
  public async deleteUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    await this.userRepository.remove(user);
  }
}
