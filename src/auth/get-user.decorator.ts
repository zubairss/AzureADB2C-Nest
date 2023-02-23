import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const authToken = request.headers.authorization.split(' ')[1];
    request.user.authToken = authToken;
    return request.user;
});