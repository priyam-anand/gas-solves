import { Module } from '@nestjs/common';
import { AuthConroller } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, JwtModule.register({})],
  controllers: [AuthConroller],
  providers: [AuthService],
})
export class AuthModule {}
