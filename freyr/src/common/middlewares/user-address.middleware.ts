import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { isAddress } from 'ethers';
import { NextFunction, Response } from 'express';

@Injectable()
export class UserAddressMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async use(req, res: Response, next: NextFunction) {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      next();
    } else {
      const token = authHeader.substring('Bearer '.length);
      const payload = this.jwtService.verify(token, {
        ignoreExpiration: true,
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      });

      if (payload?.address != undefined && isAddress(payload.address)) {
        req.user_address = payload.address?.toLowerCase();
      }
      next();
    }
  }
}
