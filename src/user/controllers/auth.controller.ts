import {
  CacheInterceptor,
  Body,
  Controller,
  Get,
  UseInterceptors,
  CacheTTL, 
  CacheKey
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../dto/auth/LoginUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey('login')
  @CacheTTL(30)
  @Get('login')
  login(@Body() loginUserDto: LoginUserDto): Promise<{ token: string }> {
    return this.authService.login(loginUserDto);
  }
}
