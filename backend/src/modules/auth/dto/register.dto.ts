import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { ProfileType } from "@puna-jote/shared";

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsEnum(ProfileType)
  profileType!: ProfileType;

  @IsString()
  displayName!: string;

  @IsOptional()
  @IsString()
  companyName?: string;
}
