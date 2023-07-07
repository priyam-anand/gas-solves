import { Module } from '@nestjs/common';
import { AuthConroller } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { RepoModule } from 'src/repo/repo.module';

@Module({
  imports: [JwtModule.register({}), RepoModule],
  controllers: [AuthConroller],
  providers: [AuthService],
})
export class AuthModule {}
