import { UserRole } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @Length(11, 11)
  phone: string;

  @IsString()
  @Length(6, 50)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
