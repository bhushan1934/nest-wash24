import { Controller, Get, Post, Body, UsePipes, ValidationPipe, HttpStatus, UseGuards, Req, Put, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterAndGenerateOtpDto } from './dto/RegisterUserDto';
import { CreateUserProfileDto } from './dto/CreateProfileDto';
import { LoginUserDto } from './dto/LoginUserDto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  
  @Post('user_registration')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  registerUser(@Body() createUserDto: RegisterAndGenerateOtpDto) {
    return this.usersService.registerAndGenerateOtp(createUserDto);
  }
  
  @Post('login')
  @UsePipes(new ValidationPipe())
  loginUser(@Body() createUserDto: LoginUserDto) {
    return this.usersService.login(createUserDto);
  }


  @Get('get_users')
  @UseGuards(AuthGuard)
  async getProfileDetails(@Req() req: any) {
    console.log(req.auth);
    const {user_id} = req.auth
    return this.usersService.getUserDetails( user_id);
  }
  @Post('create_profile')
  @UseGuards(AuthGuard)
  async updateProfile(@Body() CreateUserProfileDto : CreateUserProfileDto,  @Req() req : any) {
      const {user_id} = req.auth     
      return await this.usersService.createProfile(CreateUserProfileDto, user_id);
  }
  @Get('get_dashboard')
  @UseGuards(AuthGuard)
  async getDashboard(@Req() req: any) {
    return this.usersService.getDashboard( );
  }
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
