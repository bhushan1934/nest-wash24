import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginUserDto {
   @IsNotEmpty()
   @IsString()
   

   mobile_no: string;

   @IsNotEmpty()
   @IsString()
   otp: string;
}
