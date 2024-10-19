import { Controller, Post, Body, ValidationPipe, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';
import { LoginUserDto, LoginUserResponseDto } from './dto/login-user.dto';

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
  async login(@Body(ValidationPipe) loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    return this.usersService.login(loginUserDto);
  }
}