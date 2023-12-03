import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsersService } from '../users.service';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    
    // request.currentUser was returned from 'current-user.interceptor.ts' file
    return request.currentUser;
  },
);
