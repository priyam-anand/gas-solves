import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super({ type: 'authError', message }, status);
  }
}
