import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { LoginUserDto } from '../dto/auth/LoginUser.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // Inject the user model into the service
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ token: string; refresh_token: string }> {
    const { email, password } = loginUserDto;
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
      { expiresIn: '30d' },
    );
    const token = this.jwtService.sign({ id: user._id }, { expiresIn: '5min' });
    return { token, refresh_token };
  }

  async refresh(refreshToken: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '30m',
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
