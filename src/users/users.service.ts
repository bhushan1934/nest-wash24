import {
  HttpException,
  HttpStatus,
  Injectable,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RegisterAndGenerateOtpDto } from './dto/RegisterUserDto';
import { LoginUserDto } from './dto/LoginUserDto';
import { CreateUserProfileDto } from './dto/CreateProfileDto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { User, UserProfile } from '@prisma/client';
import * as nodeMailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
import { ExceptionFilter } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) { }



  async sendEmail(user: UserProfile, subject: string, message: string, otp: number) {
    const transporter = nodeMailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      // secure: true, // Convert to boolean if needed
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailOptions = {
      from: process.env.FROM_EMAIL,
      to: user.email,
      subject: subject,
      text: message,
    };

    // emailOptions.text += ' Your Notification Code is : ' + otp;

    await transporter.sendMail(emailOptions);
  }


  async registerAndGenerateOtp(dto: RegisterAndGenerateOtpDto): Promise<any> {
    const { mobile_no } = dto;

    // Check if the user already exists
    let user = await this.prisma.user.findUnique({
      where: { mobile_no },
    });

    if (!user) {
      // Register the user if they don't exist
      user = await this.prisma.user.create({
        data: { mobile_no },
      });
    }

    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otp_expires_at = new Date();
    otp_expires_at.setMinutes(otp_expires_at.getMinutes() + 10);

    // Update user's OTP and its expiration time
    user = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        otp,
        otp_expires_at,
      },
    });

    // TODO: Implement actual OTP sending logic here

    return {
      message: 'OTP sent successfully',
      data: {
        user_id: user.id,
        otp,
      },
    };
  }
  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string; user: any }> {
    const { mobile_no, otp } = loginUserDto;

    const user = await this.prisma.user.findUnique({
      where: {
        mobile_no: mobile_no, // Use the correct property name
        otp: otp,
        otp_expires_at: { gt: new Date() }, // Adjusted for Prisma syntax
      },
    });

    // if (!user) {
    //   return Invalid OTP or it has expired ;
    // }

    // Optional: Reset or nullify the OTP to prevent reuse
    // user.otp = null;

    const payload = { mobile_no: user.mobile_no, user_id: user.id }; // Use correct property name
    const accessToken = this.jwtService.sign(payload);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { rememberToken: accessToken },
    });
    
    
    // Prepare user data to return
    const userData = {
      id: user.id,
      mobile_no: user.mobile_no, // Use correct property name
      // Include other user fields as needed
    };

    return { accessToken, user: userData };
  }

async createProfile(createUserProfileDto:CreateUserProfileDto, user_id:number){

  const check =await this.prisma.userProfile.findUnique({
    where:{userId:user_id}
  })
if(!check){
  const newProfile = await this.prisma.userProfile.create({
    data:{
      name: createUserProfileDto.name,
      email: createUserProfileDto.email,
      pincode: createUserProfileDto.pincode,
      address: createUserProfileDto.address,
      flatNo: createUserProfileDto.flatNo,
      area: createUserProfileDto.area,
      gender: createUserProfileDto.gender,
      societyName:createUserProfileDto.societyName,
      userId:user_id
    },
    
    
  }) 
  return {
    success: true,
    statusCode: HttpStatus.CREATED,
    message: "profile added succssfully",
    data: newProfile,
  
  };
}else{
  await this.prisma.userProfile.update({
    data:{
      name: createUserProfileDto.name,
      address: createUserProfileDto.address,
      flatNo: createUserProfileDto.flatNo,
      area: createUserProfileDto.area,
      gender: createUserProfileDto.gender,
      societyName:createUserProfileDto.societyName,
    
    },
    where:{
      userId:user_id
    }
  

  }) 

  
}


  
}




async getUserDetails(user_id: number) {
  return this.prisma.user.findMany({
    where: { id: user_id }
  });
}

  
}
