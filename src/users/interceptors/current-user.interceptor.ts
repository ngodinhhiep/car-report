import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';

import { UsersService } from '../users.service';
import { Observable } from 'rxjs';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const { userId } = request.session || {}; // .session here is a property of Express.js

    // if userId is found, pass in the userId to findOneUser for it to find the data of that user
    if (userId) {
      const user = await this.usersService.findOneUser(userId);
      // take the user we have just found, and apply that data to request.currentUser
      // return request.currentUser to the file 'current-user.decorator.ts'
      request.currentUser = user;
    }
    // if userId is not defined, continue and run the handler route
    return handler.handle();
  }
}
