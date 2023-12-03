import { IsEmail,IsNumber, IsString, IsOptional } from 'class-validator';

export class updateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  username: string;

  @IsString()
  address: string;

  @IsNumber()
  phone: number;
}
