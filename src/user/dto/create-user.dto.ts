import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Level } from '../schemas/user.schema';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly first_name: string;

  @IsNotEmpty()
  @IsString()
  readonly last_name: string;

  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly password_confirmation: string;

  @IsNotEmpty()
  @IsEnum(Level)
  readonly level: Level;
}
