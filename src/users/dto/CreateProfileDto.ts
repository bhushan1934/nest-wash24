import { IsString, IsInt, IsOptional, Length, IsEmail, IsNumber, Min, Max } from 'class-validator';

export class CreateUserProfileDto {
  @IsEmail()
  email: string;

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
  area: string;

  @IsNumber()
  @Min(100000) 
  @Max(999999)
  pincode: number;
}
