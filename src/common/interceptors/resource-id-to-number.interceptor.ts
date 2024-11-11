import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ResourceIdToNumberInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(tap((x) => this.convertIdToNumber(x)));
  }

  private convertIdToNumber(resource: any) {
    for (const key in resource) {
      if (key.toLowerCase().endsWith('id')) {
        if (resource[key] === null) {
          continue;
        }
        resource[key] = +resource[key];
      } else if (typeof resource[key] === 'object') {
        this.convertIdToNumber(resource[key]);
      }
    }
  }
}
