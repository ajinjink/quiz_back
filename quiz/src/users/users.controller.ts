import { Controller, Get, Post, Delete, Body, ValidationPipe, UseInterceptors, ClassSerializerInterceptor, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';
import { LoginUserDto, LoginResponseDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './users.entity';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    console.log("signup");
    const user = await this.usersService.signup(createUserDto);
    return new CreateUserResponseDto(user);
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    return this.usersService.login(loginUserDto);
  }

  @Get('check-username')
  async checkUsername(@Query('username') username: string): Promise<{ exists: boolean }> {
    const exists = await this.usersService.checkUsernameExists(username);
    return { exists };
  }

  @Get('check-email')
  async checkEmail(@Query('email') email: string): Promise<{ exists: boolean }> {
    const exists = await this.usersService.checkEmailExists(email);
    return { exists };
  }

  @Delete('withdraw')
  @UseGuards(AuthGuard('jwt'))
  async withdrawUser(@GetUser() user: User): Promise<{ message: string }> {
    await this.usersService.withdrawUser(user.userID);
    return { message: 'User successfully deleted' };
  }
}