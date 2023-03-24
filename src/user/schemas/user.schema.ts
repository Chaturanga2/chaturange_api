import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export enum Level {
  BEGINNER = 'DEBUTANT',
  INTERMEDIATE = 'INTERMEDIAIRE',
  ADVANCED = 'AVANCE',
}

@Schema({ timestamps: true }) // Add timestamps to the schema

/**
 * @description create a user schema with mongoose
 */
export class User {
  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop({ unique: [true, 'Username already exists'] })
  username: string;

  @Prop({ unique: [true, 'Email already exists'] })
  email: string;

  @Prop()
  password: string;

  @Prop()
  level: Level;

  @Prop()
  refresh_token: string | null;
}

// export the schema
export const UserSchema = SchemaFactory.createForClass(User);
