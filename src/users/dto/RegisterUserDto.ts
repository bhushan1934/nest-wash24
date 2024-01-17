// dtos/register-and-generate-otp.dto.ts
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterAndGenerateOtpDto {
  @IsString()
  @IsNotEmpty()
  @Length(10)
  mobile_no: string;
}
