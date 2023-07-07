import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('/auth')
export class AuthConroller {
  constructor(private readonly authService: AuthService) {}

  @Get('challenge')
  async generageChallenge(): Promise<String> {
    return this.authService.generateChallenge();
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() loginData: LoginDto) {
    if (!this.authService.validateLoginData(loginData)) {
      throw new UnauthorizedException();
    }
    return this.authService.login(loginData.address);
  }

  @Post('refresh')
  @UsePipes(new ValidationPipe({ transform: true }))
  async refreshToken(
    @Body() refreshData: RefreshDto,
    @Headers('Authorization') token: string,
  ) {
    const tokenData = token.substring('Bearer '.length);
    return this.authService.refreshToken(refreshData.address, tokenData);
  }
}
