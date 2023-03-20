import {
  CacheInterceptor,
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  CacheTTL,
  CacheKey,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    this.userService.create(createUserDto);
    // return http status code 201
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey('find-all-user')
  @CacheTTL(30)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey('find-one-user')
  @CacheTTL(30)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.userService.update(id, updateUserDto);
    return { message: 'User updated successfully' };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.userService.remove(id);
    return { message: 'User deleted successfully' };
  }
}
