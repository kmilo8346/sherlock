import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class User {
  _id!: string;
  username!: string;
  password!: string;
  created_at!: string;
  updated_at!: string;
}

export class CreateUser {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class UpdateUser {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  username!: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password!: string;
}
