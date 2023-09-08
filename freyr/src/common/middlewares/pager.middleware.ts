import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

@Injectable()
export class PagerMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    req.query.limit = Number(req.query.limit) || 20;
    req.query.offset = Number(req.query.offset) || 0;
    next();
  }
}
