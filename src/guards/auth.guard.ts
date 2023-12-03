import {
    CanActivate,
    ExecutionContext
} from '@nestjs/common';
import { Observable } from 'rxjs';

export class AuthGuard implements CanActivate{
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        // if the userId exists, return the value. If not, access is prevented from the given controller or handler
        return request.session.userId;
    }
}