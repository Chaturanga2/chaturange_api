import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Level, User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { LoginUserDto } from '../dto/auth/LoginUser.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserLoginType } from '../../types/user.types';

@Injectable()
export class AuthService {
  // Inject the user model into the service
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<UserLoginType> {
    const { email, password } = loginUserDto;
    const cachedData = await this.cacheService.get<LoginUserDto>('login');
    if (cachedData) {
      const isMatch = await bcrypt.compare(password, cachedData.password);
      if (!isMatch) {
        await this.cacheService.del('login');
      }
      throw new NotFoundException('User already connected');
    }
    // Find the user in the database
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Email or password is incorrect');
    }
    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new NotFoundException('Email or password is incorrect');
    }
    // stor the refresh token in the database
    const refresh_token = this.jwtService.sign(
      { id: user._id },
      { expiresIn: '30d', secret: 'mamamia' },
    );
    const token = this.jwtService.sign(
      { username: user.username, id: user._id },
      { expiresIn: '5m', secret: 'mamamia' },
    );

    return {
      token,
      refresh_token,
      user: {
        id: user._id,
        username: user.username,
      },
    };
  }

  /**
   * @description create a new user
   * @param createUserDto
   * @returns {Promise<User>}
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // destructure the createUserDto object
    const { first_name, last_name, username, email, password } = createUserDto;
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user object
    return await this.userModel.create({
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword,
      level: Level.BEGINNER,
    });
  }

  logout(): void {
    this.cacheService.del('login');
    // delete the refresh token
  }

  async refresh(refreshToken: string): Promise<{ access_token: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '3m',
      });
      return {
        access_token: accessToken,
      };
    } catch (error) {
      // handle error if refresh token is invalid
      throw new NotFoundException('Refresh token is invalid');
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const payload = this.jwtService.verify(token);
      return true;
    } catch (error) {
      return false;
    }
  }
}
