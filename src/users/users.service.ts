import {
  HttpException,
  HttpStatus,
  Injectable,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RegisterAndGenerateOtpDto } from './dto/RegisterUserDto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import * as nodeMailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

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
}
