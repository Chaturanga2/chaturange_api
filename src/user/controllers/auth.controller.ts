import {
  CacheInterceptor,
  Body,
  Controller,
  UseInterceptors,
  CacheTTL,
  CacheKey,
  Post,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../dto/auth/LoginUser.dto';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey('login')
  @CacheTTL(30)
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto): Promise<{ token: string }> {
    return this.authService.login(loginUserDto);
  }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    this.authService.create(createUserDto);
    // return http status code 201
    return { message: 'User created successfully' };
  }

  // logout the user by deleting the refresh token from the database
  @Post('logout')
  logout() {
    this.authService.logout();
    return { message: 'User logged out successfully' };
  }

  // refresh the token
  @Post('refresh')
  refresh(@Body() refreshTokenDto: string) {
    return this.authService.refresh(refreshTokenDto);
  }
}
