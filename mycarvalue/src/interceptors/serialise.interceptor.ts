import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Any class
interface ClassConstructor {
  new (...args: any[]): unknown; //  any value
}

// Custom decorator
export function Serialise(dto: ClassConstructor) {
  return UseInterceptors(new SerialiseInterceptor(dto));
}

export class SerialiseInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true, // only include @Expose() properties
        });
      }),
    );
  }
}
