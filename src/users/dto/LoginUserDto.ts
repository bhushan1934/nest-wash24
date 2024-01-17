import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDto {
   @IsNotEmpty()
   @IsString()
   @Length(10) 
   mobile_no: string;

   @IsNotEmpty()
   @IsString()
   @Length(4)
   otp: string;
}
