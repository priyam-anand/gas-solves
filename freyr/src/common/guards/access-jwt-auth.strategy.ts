import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from 'src/repo/entities/user.entity';
import { UserRepoService } from 'src/repo/user-repo.service';
import { AUTH_STRATEGY } from '../utils/constants';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGY,
) {
  constructor(
    private userRepoService: UserRepoService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: any) {
    const { address } = payload;
    if (!address) {
      throw new HttpException('Invalid access token', HttpStatus.UNAUTHORIZED);
    }

    let result: User;

    try {
      result = <User>await this.userRepoService.getUser({
        where: { address: address },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }

    if (!result) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    return result;
  }
}
