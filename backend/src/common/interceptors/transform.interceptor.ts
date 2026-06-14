import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        if (data && data.__rawResponse) {
          delete data.__rawResponse;
          return data;
        }

        const pageInfo = data?.page !== undefined ? {
          page: data.page,
          limit: data.limit,
          total: data.total,
          totalPages: data.totalPages,
        } : undefined;

        const responseData = pageInfo ? data.data : data;

        return {
          statusCode: response.statusCode,
          message: 'Success',
          data: responseData,
          timestamp: new Date().toISOString(),
          ...(pageInfo && { pagination: pageInfo }),
        };
      }),
    );
  }
}
