import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserI } from '../types/interfaces';

export const User = createParamDecorator(
    (data: string, ctx: ExecutionContext): UserI => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        return data ? user?.[data] : user;
    },
);
