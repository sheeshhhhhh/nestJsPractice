import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class changeUserInfoDto {
  @IsEmail()
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  bio?: string;

  @IsString()
  name: string;
}
