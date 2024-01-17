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
import { PrismaClient } from '@prisma/client';
import * as nodeMailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
import { ExceptionFilter } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) { }



  async sendEmail(user: UserProfile, subject: string, message: string) {
    const transporter = nodeMailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Note: Set to true in production
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

    try {
      let user = await this.prisma.user.findUnique({ where: { mobile_no } });

      if (!user) {
        user = await this.prisma.user.create({ data: { mobile_no } });
      }

      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const otp_expires_at = new Date();
      otp_expires_at.setMinutes(otp_expires_at.getMinutes() + 1000);

      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { otp, otp_expires_at },
      });

      // TODO: Implement actual OTP sending logic here

      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "Registered successfully",
        data: { user_id: user.id, otp },
      };
    } catch (error) {
      throw new HttpException('Error registering user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  async login(loginUserDto: LoginUserDto): Promise<any> {
    const { mobile_no, otp } = loginUserDto;
  
    const user = await this.prisma.user.findFirst({
      where: {
        mobile_no: mobile_no,
        otp: otp,
        otp_expires_at: { gt: new Date() },
      },
    });
  
    if (!user) {
      throw new HttpException('Invalid OTP or it has expired', HttpStatus.BAD_REQUEST);
    }
  
    // Optional: Reset or nullify the OTP to prevent reuse
    await this.prisma.user.update({
      where: { id: user.id },
      data: { otp: null }, // Reset OTP after successful login
    });
  
    const payload = { mobile_no: user.mobile_no, user_id: user.id };
    const accessToken = this.jwtService.sign(payload);
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: { rememberToken: accessToken },
    });
    
    const userData = {
      id: user.id,
      mobile_no: user.mobile_no,
    };
  
    return {
      success: true,
      statusCode: HttpStatus.OK, // Use OK for successful login
      message: "Login successfully",
      data: { userData, accessToken }
    };
  }
  

  async logout(user_id: number): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: user_id } });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await this.prisma.user.update({
        where: { id: user_id },
        data: { rememberToken: null }, 
      });

      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Logout successful",
        data: []
      };
    } catch (error) {
      console.error('Error during logout:', error);
      throw new HttpException('Error during logout', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



async createProfile(createUserProfileDto:CreateUserProfileDto, user_id:number){
    try {
      const existingProfile = await this.prisma.userProfile.findUnique({
        where: { id: user_id }
      });

      if (existingProfile) {
        throw new HttpException('Profile already exists', HttpStatus.BAD_REQUEST);
      }

  const profileData = await this.prisma.userProfile.create({
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
  // Send welcome email after successful profile creation or update
  // const subject = "Welcome to Our Service!";
  // const message = "Your profile has been successfully created.";
  // await this.sendEmail(profileData, subject, message,);
  return {
    success: true,
    statusCode: HttpStatus.CREATED,
    message: "Profile added successfully",
    data: profileData,
  };

} catch (error) {
  // Log error for debugging
  console.error(error);

  // If error is not a HttpException, create a generic one
  if (!(error instanceof HttpException)) {
    throw new HttpException('Failed to create profile', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  // Re-throw the error if it's already a HttpException
  throw error;
}
}



async getUserDetails(userId: number) {
  // Validate userId
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
  }

  try {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profiles: true, // Assuming 'profiles' is the relation field in the User model
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: "Profile fetched successfully",
      data: user,
    };  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Throw a generic internal server error to the client
    throw new HttpException('Failed to retrieve user details', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


async getDashboard() {
  try {
    const dashboardData = await this.prisma.dashboard.findMany();
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: "dashboard data fetched successfully",
      data: dashboardData,
    };   } catch (error) {
    // Log the error for debugging purposes
    console.error('Error retrieving dashboard data:', error);

    // Throw a generic internal server error to the client
    throw new HttpException('Failed to retrieve dashboard data', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

  
}
