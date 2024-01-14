import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards, Req, Put, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterAndGenerateOtpDto } from './dto/RegisterUserDto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('user_registration')
  registerUser(@Body() createUserDto: RegisterAndGenerateOtpDto) {
    return this.usersService.registerAndGenerateOtp(createUserDto);
  }


  // @Post('login')
  // loginUser(@Body() createUserDto: LoginUserDto) {
  //   return this.usersService.loginUser(createUserDto);
  // }  
 
  // @Post('forgot_password')
  // forgetPassword(@Body() forgotPasswordDTO: ForgetPassword) {
  //   return this.usersService.forgetPassword(forgotPasswordDTO);
  // }  
 
  // @Post('verify-otp')
  // async verifyOTP(@Body() body: VerifyOtpDTO) {
  //     const { email, otp } = body;
  //     return await this.usersService.verifyOTP(email, otp);
  // }
  // @Post('verify-login-otp')
  // async verifyLoginOTP(@Body() body: VerifyOtpDTO) {
  //     const { email, otp } = body;
  //     return await this.usersService.verifyLoginOTP(email, otp);
  // }

  // @Post('resend_otp')
  // async resendOTP(@Body() body: ResendOTP) {
  //     return await this.usersService.resendOTP(body.email);
  // }

  // @Post('update_password')
  // async updatePassword(@Body() body: UpdatePasswordDTO) {
  //     return await this.usersService.changePassword(body);
  // }


  
  // @Post('register')
  // @UseGuards(AuthGuard)
  // async profileAdd(
  //   @Body() profileData : ProfileAddDto, @Req() req : any
  // ){
  //     const {user_id} = req.auth     
  //     return await this.usersService.registerAndGenerateOtp(profileData, user_id);
  // }

  // @Get('get_profile_details')
  // @UseGuards(AuthGuard)
  // async getProfileDetails(@Req() req : any) {   
  //   const {user_id} = req.auth 
  //     return await this.usersService.getProfileDetails(user_id);
  // }
  
  // @Put('update_profile')
  // @UseGuards(AuthGuard)
  // async updateProfile(@Body() updateProfileDto : UpdateProfileDto,  @Req() req : any) {
  //     const {user_id} = req.auth     
  //     return await this.usersService.updateProfile(updateProfileDto, user_id);
  // }

  // @Get('get_subscriptions')
  // async getSubscriptions(){
  //   return await this.usersService.getAllSubscriptions();
  // }

  
  // @Post()
  // create(@Body() createUserDto: RegisterUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateProfileDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
