import { IsString, IsInt, IsOptional, Length, IsEmail, IsNumber } from 'class-validator';

export class CreateUserProfileDto {
  
  
@IsEmail()
email:string;

  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  gender: string;

  @IsString()
  flatNo: string;

  @IsString()
  societyName: string;

  @IsString()
  @Length(0, 200)
  area: string;

  @IsNumber()
  pincode: number;
}

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  flatNo?: string;

  @IsOptional()
  @IsString()
  societyName?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  area?: string;
}
