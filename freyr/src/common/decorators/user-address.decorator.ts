import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserAddress = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user_address;
  },
);
