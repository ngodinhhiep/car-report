import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface MustBeClass {
  new (...args: any[]): {};
}

// things passed into user_dto has to be a class to be assignable to MustBeClass
export function Serialize(user_dto: MustBeClass) {
  return UseInterceptors(new SerializeInterceptor(user_dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        // data is the entity returned

        // transform data as UserDto type
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
