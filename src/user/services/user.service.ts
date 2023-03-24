import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  Inject,
  Injectable,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Level, User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  // Inject the user model into the service
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * @description create a new user
   * @param createUserDto
   * @returns {Promise<User>}
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // destructure the createUserDto object
    const { first_name, last_name, username, email, password, level } =
      createUserDto;
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

  /**
   * @description find all users in the database
   * @returns {Promise<User[]>}
   */
  @UseInterceptors(CacheInterceptor)
  @CacheKey('users')
  @CacheTTL(30)
  // eslint-disable-next-line @typescript-eslint/ban-types
  async findAll(): Promise<User | {}> {
    const cachedUsers = await this.cacheService.get('users');
    if (cachedUsers) {
      return cachedUsers;
    }
    const users = await this.userModel.find().exec();
    await this.cacheService.set('users', users);
    return users;
  }

  /**
   * @description find a user by id in the database
   * @param id
   * @returns {Promise<User>}
   */
  @UseInterceptors(CacheInterceptor)
  @CacheKey('user')
  @CacheTTL(30)
  // eslint-disable-next-line @typescript-eslint/ban-types
  async findOne(id: string): Promise<User | {}> {
    const cachedUsers = await this.cacheService.get('user');
    if (cachedUsers) {
      return cachedUsers;
    }
    const user = await this.userModel.findById(id);
    await this.cacheService.set('user', user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * @description update a user by id in the database
   * @param id
   * @param updateUserDto
   * @returns {Promise<User>}
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * @description delete a user by id in the database
   * @param id
   * @returns {Promise<User>}
   */
  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id);
  }
}
