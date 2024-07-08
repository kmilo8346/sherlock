import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class Credentials {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export interface IJwtToken {
  access_token: string;
  token_type: string;
}

export interface IJwtPayload {
  sub: string;
  username: string;
  iat: number;
  exp: number;
}
