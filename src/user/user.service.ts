import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  // Inject the user model into the service
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
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
      level,
    });
  }

  /**
   * @description find all users in the database
   * @returns {Promise<User[]>}
   */
  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  /**
   * @description find a user by id in the database
   * @param id
   * @returns {Promise<User>}
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
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
