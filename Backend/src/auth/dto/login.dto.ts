import {
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  phone: string;

  @IsString()
  @Length(6, 50)
  password: string;
}