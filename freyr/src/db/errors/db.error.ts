import { HttpException, HttpStatus } from '@nestjs/common';

export class DbException extends Error {
  public status: HttpStatus;
  constructor(message: string, status: HttpStatus) {
    super(message);
    this.status = status;
  }
}
