import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '../users/users.entity';

@Controller('token')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refreshTokens(
    @GetUser() user: User & { refreshToken: string }
  ) {
    return this.authService.refreshTokens(
      user.userID, 
      user.refreshToken
    );
  }
}