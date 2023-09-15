import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_STRATEGY } from '../utils/constants';

@Injectable()
export class AccessJwtAuthGuard extends AuthGuard(AUTH_STRATEGY) {}
