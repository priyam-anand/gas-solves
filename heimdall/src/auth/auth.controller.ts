import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('/auth')
export class AuthConroller {
  constructor(private readonly authService: AuthService) {}

  @Get('challenge')
  async generageChallenge(): Promise<String> {
    return this.authService.generateChallenge();
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginData: LoginDto) {
    if (!this.authService.validateLoginData(loginData)) {
      throw new UnauthorizedException();
    }
    return this.authService.login(loginData.address);
  }

  @Post('refresh')
  async refreshToken(@Req() req) {}
}
