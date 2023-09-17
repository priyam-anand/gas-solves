import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { ADMIN_STRATEGY } from '../utils/constants';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AdminApiAuthStrategy extends PassportStrategy(
  Strategy,
  ADMIN_STRATEGY,
) {
  constructor(private configService: ConfigService) {
    super();
  }

  async validate(req: Request) {
    const apiKey = req.header('x-api-key');
    if (!apiKey) {
      throw new HttpException('x-api-key not found', HttpStatus.UNAUTHORIZED);
    }

    if (apiKey !== this.configService.get('ADMIN_API_KEY')) {
      throw new HttpException('invalid x-api-key', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
