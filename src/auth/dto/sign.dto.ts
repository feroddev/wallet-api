import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  name: string;
  
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  email: string;
  
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  password: string;
}