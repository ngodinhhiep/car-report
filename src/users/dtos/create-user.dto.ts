import { IsEmail, IsNumber, IsOptional, IsBoolean, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsNumber()
  phone: number;

  @IsOptional()
  admin: string;
}
