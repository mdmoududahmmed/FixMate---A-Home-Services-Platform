import { IsOptional, IsEnum, IsString, IsNotEmpty, Length } from 'class-validator';
import { UserRole } from '@prisma/client';

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

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}