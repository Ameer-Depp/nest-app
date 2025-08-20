import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDTO } from './dtos/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';

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
      throw new BadRequestException('user already exists');
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
}
