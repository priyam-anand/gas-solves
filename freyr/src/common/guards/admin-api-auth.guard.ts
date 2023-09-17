import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ADMIN_STRATEGY } from '../utils/constants';

@Injectable()
export class AdminApiAuthGuard extends AuthGuard(ADMIN_STRATEGY) {}
